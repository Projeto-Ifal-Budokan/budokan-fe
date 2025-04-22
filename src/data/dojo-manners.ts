export interface Manner {
    id: number;
    title: String;
    description: String;
    comment: String;
}

export const dojoManners: Manner[] = [
    {
        id: 1,
        title: 'Reverência ao Dojo',
        description: 'Ao entrar ou sair do Dojo, faça uma reverência (curvando-se levemente e baixando a cabeça) e diga "Oss"',
        comment: 'Essa saudação demonstra respeito ao local de treino e aos ensinamentos que ali são transmitidos. É um ritual de conexão com a tradição.'
    },

    {
        id: 2,
        title: 'Cuidados na Entrada',
        description: 'Sempre deixe seus chinelos ou sapatos no local indicado na entrada do Dojo, com as pontas voltadas para a parede',
        comment: 'A organização dos calçados simboliza ordem, respeito ao espaço e atenção aos detalhes — qualidades fundamentais no Karatê.'
    },

    {
        id: 3,
        title: 'Respeito ao Adentrar',
        description: 'Cumprimente o Sensei, os Senpai e os demais colegas com prontidão e respeito. Em seguida, dirija-se diretamente ao vestiário para se trocar',
        comment: 'Essa atitude preserva a harmonia no ambiente e estabelece o clima de respeito mútuo entre todos.'
    },

    {
        id: 4,
        title: 'Pontualidade',
        description: 'Procure chegar ao Dojo com pelo menos 15 minutos de antecedência. Atrasos são considerados desrespeitosos',
        comment: 'Chegar cedo mostra comprometimento e permite que você prepare corpo e mente para a prática.'
    },

    {
        id: 5,
        title: 'Soji',
        description: 'Participe do “Soji” (limpeza) do Dojo antes, entre e após os treinos',
        comment: 'Limpar o Dojo não é apenas uma tarefa física, mas um exercício de humildade e cuidado com o espaço sagrado do treino.'
    },

    {
        id: 6,
        title: 'Disciplina e Comprometimento',
        description: 'Poucos minutos antes da prática, esteja aquecido e em formação, respeitando a hierarquia',
        comment: 'Isso demonstra disciplina e prontidão para começar o treino com a energia e concentração adequadas.'
    },

    {
        id: 7,
        title: 'Foco',
        description: 'Esvazie a mente dos problemas do dia e prepare-se para absorver os ensinamentos da melhor forma possível',
        comment: 'A prática do Karatê exige foco total. Trazer problemas externos para o tatame compromete a sua evolução e a dos demais.'
    },

    {
        id: 8,
        title: 'Shomen-ni',
        description: 'A aula se inicia e termina com o “Shomen-ni”.',
        comment: 'O início da aula é um momento solene. Perder esse momento quebra o ritmo do grupo e pode prejudicar a energia do treino.'
    },

    {
        id: 9,
        title: 'Permissão de Entrada',
        description: 'Se houver motivo para atraso, aguarde no fundo do Dojo, em seiza, até que o Sensei permita sua entrada',
        comment: 'Esse gesto mostra respeito pela ordem do treino e pela autoridade do Sensei.'
    },

    {
        id: 10,
        title: 'Zelo e Cuidado',
        description: 'Mantenha o Karatê-Gui (ou kimono) sempre limpo e em perfeitas condições de uso',
        comment: 'A aparência do uniforme reflete seu zelo com a prática. Treinar de forma descuidada é desrespeitoso.'
    },

    {
        id: 11,
        title: 'Higiene e Apresentação Pessoal',
        description: 'Cuide da apresentação pessoal: higiene, cabelo arrumado, unhas cortadas, sem acessórios',
        comment: 'Esses cuidados evitam acidentes e demonstram seriedade com o caminho do guerreiro.'
    },

    {
        id: 12,
        title: 'Conduta nas Ações',
        description: 'Nunca arrume o kimono ou a faixa de frente para o Sensei, o Kamiza ou as imagens dos patriarcas',
        comment: 'Trata-se de um gesto simbólico de reverência. Ajustes devem ser feitos de lado ou de costas, discretamente.'
    },

    {
        id: 13,
        title: 'Reverência ao Sensei',
        description: 'Respeite o Sensei como um representante da linhagem do Karatê',
        comment: 'O Sensei não é apenas um instrutor técnico, mas um guardião de valores e tradições.'
    },

    {
        id: 14,
        title: 'Vigilância e Atenção',
        description: 'Mantenha-se sempre atento dentro do Dojo',
        comment: 'O ambiente de treino exige vigilância, não apenas física, mas também mental e espiritual.'
    },

    {
        id: 15,
        title: 'Reverência aos Ensinamentos',
        description: 'Quando o Sensei demonstrar uma técnica, pare imediatamente e preste atenção',
        comment: 'Esse é um momento precioso. Assistir com atenção é parte fundamental do aprendizado.'
    },

    {
        id: 16,
        title: 'Respeito Hierárquico',
        description: 'Respeite os mais experientes. Nunca discuta técnica durante o treino',
        comment: 'O Dojo é um lugar de prática, não de debate. As dúvidas devem ser levadas ao Sensei com humildade.'
    },

    {
        id: 17,
        title: 'Foco na Prática',
        description: 'Durante a aula, não converse',
        comment: 'Conversas distraem e quebram a concentração. A prática silenciosa é mais eficaz.'
    },

    {
        id: 18,
        title: 'Permissão de Fala',
        description: 'Se for necessário perguntar algo, aproxime-se do Sensei e espere sua permissão para falar',
        comment: 'Isso evita interromper o fluxo da aula e valoriza a hierarquia do ensino.'
    },

    {
        id: 19,
        title: 'Companheirismo',
        description: 'No início e fim de cada técnica, cumprimente seu parceiro e diga "Oss"',
        comment: 'A saudação ao parceiro é um reconhecimento da parceria e da confiança no treino conjunto.'
    },

    {
        id: 20,
        title: 'Apoio com Cuidado',
        description: 'Se você conhece a técnica e seu parceiro não, conduza-o com cuidado, mas não o corrija — a menos que seja um Senpai',
        comment: 'A instrução formal cabe ao Sensei ou a praticantes autorizados. Isso evita confusões ou erros no aprendizado.'
    },

    {
        id: 21,
        title: 'Responsabilidade',
        description: 'Sua graduação traz também uma responsabilidade proporcional',
        comment: 'Quanto maior sua faixa, maior sua obrigação de dar o exemplo, dentro e fora do tatame.'
    }
];
