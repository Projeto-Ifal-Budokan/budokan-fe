import crypto from 'node:crypto';

/**
 * Verificacao do ID token do Google Identity Services.
 *
 * O botao "Sign in with Google" devolve ao navegador um `credential` — um ID token. Esse
 * token e a prova de identidade, e ele so vale se o servidor conferir. Aceitar o token sem
 * verificar e a falha classica: qualquer pagina consegue um token valido emitido para o
 * proprio Google e entrega a identidade de outra pessoa.
 *
 * O que e conferido, e por que:
 *   - assinatura RSA com a chave publica do Google (JWKS, chave escolhida pelo `kid` do
 *     cabecalho) — prova que veio do Google;
 *   - `aud` == nosso client ID — prova que o token foi emitido PARA este site. Um token
 *     roubado de outro site e recusado aqui, e isso tambem fecha o CSRF: um formulario de
 *     outro dominio nao consegue fazer um token com o nosso `aud` aparecer nesta rota;
 *   - `iss` — os dois formatos que o Google emite;
 *   - `exp`/`iat` com tolerancia relogio, e `sub` presente.
 *
 * Sem dependencia nova: Node 23 ja tem `createPublicKey({ format: 'jwk' })` e `verify`, e e
 * isso que a lib oficial usa por baixo. Menos um pacote no bundle, e a politica de
 * verificacao fica legivel em um arquivo so.
 *
 * `sub` e o identificador: o Google diz para nunca usar e-mail, porque a mesma conta troca
 * de endereco. Guardamos o `sub`, que e opaco — menos dado pessoal que guardar o e-mail, que
 * a gente nem precisa para exibir um depoimento.
 */

const JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const ISSUERS = new Set(['https://accounts.google.com', 'accounts.google.com']);
/** as chaves rodam; 10 min de cache e o suficiente e rebuscar na falta do `kid` */
const KEY_TTL_MS = 10 * 60 * 1000;
const CLOCK_SKEW_SECONDS = 300;
const SUB_MAX = 64;
const NAME_MAX = 60;

export interface GoogleProfile {
  sub: string;
  name: string;
  picture: string;
}

interface Jwk {
  kid?: string;
  kty?: string;
  alg?: string;
  n?: string;
  e?: string;
}

type KeyMap = Map<string, crypto.KeyObject>;
type KeyGetter = (forceRefresh: boolean) => Promise<KeyMap>;

let cache: { keys: KeyMap; at: number } | null = null;

const fetchKeys = async (): Promise<KeyMap> => {
  const response = await fetch(JWKS_URL, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`google: JWKS respondeu ${response.status}`);
  }

  const body = (await response.json()) as { keys?: Jwk[] };
  const keys: KeyMap = new Map();

  for (const jwk of body.keys ?? []) {
    if (!jwk.kid) continue;
    try {
      keys.set(
        jwk.kid,
        crypto.createPublicKey({ key: jwk as crypto.JsonWebKey, format: 'jwk' })
      );
    } catch {
      // chave em formato que esta versao do Node nao monta: segue sem ela, a busca por kid
      // cai no refresh forcado e, se persistir, a verificacao falha aberto
    }
  }

  if (keys.size === 0) {
    throw new Error('google: JWKS sem chaves usaveis');
  }

  return keys;
};

const keysFor: KeyGetter = async (forceRefresh) => {
  const fresh = cache !== null && Date.now() - cache.at < KEY_TTL_MS;
  if (!forceRefresh && fresh && cache) return cache.keys;

  const keys = await fetchKeys();
  cache = { keys, at: Date.now() };
  return keys;
};

const decodeSegment = (segment: string): Record<string, unknown> =>
  JSON.parse(Buffer.from(segment, 'base64url').toString('utf8')) as Record<
    string,
    unknown
  >;

const audienceMatches = (aud: unknown, clientId: string): boolean =>
  Array.isArray(aud) ? aud.includes(clientId) : aud === clientId;

/**
 * URL da foto no tamanho que o depoimento usa.
 *
 * O Google coloca o tamanho como sufixo depois do ultimo `=` (`...=s96-c`). Trocar o
 * sufixo e o unico jeito de pedir um recorte quadrado de 128 px; acrescentar outro `=`
 * produz URL que o Google devolve 404.
 */
export const sizedPictureUrl = (picture: string): string => {
  try {
    const url = new URL(picture);
    if (
      url.hostname !== 'googleusercontent.com' &&
      !url.hostname.endsWith('.googleusercontent.com')
    ) {
      return picture;
    }
    return `${picture.replace(/=[^=]*$/, '')}=s128-c`;
  } catch {
    return picture;
  }
};

export const verifyGoogleIdToken = async (
  credential: string,
  clientId: string,
  getter: KeyGetter = keysFor
): Promise<GoogleProfile> => {
  const parts = credential.split('.');
  if (parts.length !== 3) {
    throw new Error('credential: formato de token inesperado');
  }
  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  const header = decodeSegment(encodedHeader);
  if (header.alg !== 'RS256') {
    throw new Error('credential: algoritmo inesperado (esperado RS256)');
  }
  const kid = typeof header.kid === 'string' ? header.kid : '';
  if (kid === '') {
    throw new Error('credential: sem kid no cabecalho');
  }

  // kid desconhecido quase sempre e rotacao de chave: um refresh e tenta de novo
  let key = (await getter(false)).get(kid);
  if (!key) {
    key = (await getter(true)).get(kid);
  }
  if (!key) {
    throw new Error('credential: chave do Google nao encontrada');
  }

  const signed = Buffer.from(`${encodedHeader}.${encodedPayload}`, 'utf8');
  const signature = Buffer.from(encodedSignature, 'base64url');
  if (!crypto.verify('RSA-SHA256', signed, key, signature)) {
    throw new Error('credential: assinatura invalida');
  }

  const payload = decodeSegment(encodedPayload);
  const nowSeconds = Math.floor(Date.now() / 1000);

  if (!ISSUERS.has(String(payload.iss ?? ''))) {
    throw new Error('credential: emissor inesperado');
  }
  if (!audienceMatches(payload.aud, clientId)) {
    throw new Error('credential: token emitido para outro site');
  }
  if (
    typeof payload.exp !== 'number' ||
    payload.exp < nowSeconds - CLOCK_SKEW_SECONDS
  ) {
    throw new Error('credential: token expirado');
  }
  if (typeof payload.iat !== 'number') {
    throw new Error('credential: sem iat');
  }

  const sub = String(payload.sub ?? '');
  if (sub.length === 0 || sub.length > SUB_MAX) {
    throw new Error('credential: sub ausente ou longo demais');
  }

  const picture = typeof payload.picture === 'string' ? payload.picture : '';
  if (!picture.startsWith('https://')) {
    throw new Error('credential: conta sem foto');
  }

  const name =
    typeof payload.name === 'string' && payload.name.trim() !== ''
      ? payload.name.trim()
      : String(payload.email ?? '')
          .split('@')[0]
          .trim();
  if (name.length < 2) {
    throw new Error('credential: conta sem nome');
  }

  return { sub, name: name.slice(0, NAME_MAX), picture };
};
