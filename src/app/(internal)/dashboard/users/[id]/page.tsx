'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useManageUsers } from '@/lib/api/queries/use-manage-users';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Mail,
  MapPin,
  Phone,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { fetchUser } = useManageUsers();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users', id],
    enabled: !!id,
    queryFn: () => fetchUser(id),
  });

  if (isLoading) {
    return <span>carregando....</span>;
  }

  if (!user) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <AlertTriangle className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
          <h3 className='text-lg font-semibold'>Usuário não encontrado</h3>
          <p className='text-muted-foreground'>
            O usuário solicitado não existe ou foi removido.
          </p>
          <Button onClick={() => router.back()} className='mt-4'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  //   const getTipoColor = (tipo: string) => {
  //     switch (tipo) {
  //       case 'Administrador':
  //         return 'destructive';
  //       case 'Instrutor':
  //         return 'default';
  //       case 'Aluno':
  //         return 'secondary';
  //       default:
  //         return 'outline';
  //     }
  //   };

  const getStatusColor = (status: string) => {
    return status === 'Ativo' ? 'default' : 'secondary';
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' onClick={() => router.back()}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar
          </Button>
          <div>
            <h1 className='text-3xl font-bold'>Perfil do Usuário</h1>
            <p className='text-muted-foreground'>
              Informações detalhadas do usuário
            </p>
          </div>
        </div>
        <Button>
          <Edit className='mr-2 h-4 w-4' />
          Editar Usuário
        </Button>
      </div>

      {/* User Header Card */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-start gap-6'>
            <Avatar className='h-24 w-24'>
              <AvatarImage
                // src={user.avatar || '/placeholder.svg'}
                alt={user.firstName}
              />
              <AvatarFallback className='text-lg'>
                {user.firstName}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='mb-2 flex items-center gap-3'>
                <h2 className='text-2xl font-bold'>{user.firstName}</h2>
                {/* <Badge variant={getTipoColor(user.tipo) as any}>
                  {user.tipo}
                </Badge> */}
                <Badge variant={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
              </div>
              <div className='text-muted-foreground grid grid-cols-1 gap-4 text-sm md:grid-cols-2'>
                <div className='flex items-center gap-2'>
                  <Mail className='h-4 w-4' />
                  {user.email}
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='h-4 w-4' />
                  {user.phone}
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  Membro desde{' '}
                  {/* {new Date(user.criadoEm).toLocaleDateString('pt-BR')} */}
                </div>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4' />
                  {/* Último acesso: {user.ultimoAcesso} */}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Content */}
      <Tabs defaultValue='geral' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-5'>
          <TabsTrigger value='geral'>Geral</TabsTrigger>
          <TabsTrigger value='permissoes'>Permissões</TabsTrigger>
          <TabsTrigger value='atividades'>Atividades</TabsTrigger>
          <TabsTrigger value='configuracoes'>Configurações</TabsTrigger>
          {/* {user.tipo === 'Aluno' && (
            <TabsTrigger value='academico'>Acadêmico</TabsTrigger>
          )}
          {user.tipo === 'Instrutor' && (
            <TabsTrigger value='profissional'>Profissional</TabsTrigger>
          )} */}

          {/* {hasAccess('student', user) ? (
            <TabsTrigger value='academico'>Acadêmico</TabsTrigger>
          ) : (
            <TabsTrigger value='profissional'>Profissional</TabsTrigger>
          )} */}
        </TabsList>

        {/* General Tab */}
        <TabsContent value='geral' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-muted-foreground text-sm font-medium'>
                      Nome Completo
                    </label>
                    <p className='font-medium'>{user.firstName}</p>
                  </div>
                  <div>
                    <label className='text-muted-foreground text-sm font-medium'>
                      Data de Nascimento
                    </label>
                    <p className='font-medium'>
                      {user.birthDate
                        ? new Date(user.birthDate).toLocaleDateString('pt-BR')
                        : 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <label className='text-muted-foreground text-sm font-medium'>
                      CPF
                    </label>
                    <p className='font-medium'>{'Não informado'}</p>
                  </div>
                  <div>
                    <label className='text-muted-foreground text-sm font-medium'>
                      RG
                    </label>
                    {/* <p className='font-medium'>{user.rg || 'Não informado'}</p> */}
                  </div>
                </div>
                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    Endereço
                  </label>
                  <p className='flex items-center gap-2 font-medium'>
                    <MapPin className='h-4 w-4' />
                    {/* {user.endereco || 'Não informado'} */}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Phone className='h-5 w-5' />
                  Contato de Emergência
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* {user.contato_emergencia ? (
                  <div className='space-y-3'>
                    <div>
                      <label className='text-muted-foreground text-sm font-medium'>
                        Nome
                      </label>
                      <p className='font-medium'>
                        {user.contato_emergencia.nome}
                      </p>
                    </div>
                    <div>
                      <label className='text-muted-foreground text-sm font-medium'>
                        Telefone
                      </label>
                      <p className='font-medium'>
                        {user.contato_emergencia.telefone}
                      </p>
                    </div>
                    <div>
                      <label className='text-muted-foreground text-sm font-medium'>
                        Parentesco
                      </label>
                      <p className='font-medium'>
                        {user.contato_emergencia.parentesco}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className='text-muted-foreground'>
                    Nenhum contato de emergência cadastrado
                  </p>
                )} */}
              </CardContent>
            </Card>
          </div>

          {/* {user.observacoes && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FileText className='h-5 w-5' />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>{user.observacoes}</p>
              </CardContent>
            </Card>
          )} */}
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value='permissoes' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Shield className='h-5 w-5' />
                Permissões do Sistema
              </CardTitle>
              <CardDescription>
                Permissões e acessos concedidos ao usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-3'>
                {/* {user.permissoes.map((permissao, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 rounded-lg border p-3'
                  >
                    <CheckCircle className='h-5 w-5 text-green-500' />
                    <span className='font-medium'>{permissao}</span>
                  </div>
                ))} */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value='atividades' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Activity className='h-5 w-5' />
                Atividades Recentes
              </CardTitle>
              <CardDescription>
                Histórico de ações realizadas pelo usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {/* {user.atividades_recentes.map((atividade, index) => (
                  <div
                    key={index}
                    className='flex items-start gap-4 rounded-lg border p-4'
                  >
                    <div className='mt-2 h-2 w-2 rounded-full bg-blue-500'></div>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <p className='font-medium'>{atividade.acao}</p>
                        <span className='text-muted-foreground text-sm'>
                          {atividade.data}
                        </span>
                      </div>
                      {atividade.detalhes && (
                        <p className='text-muted-foreground mt-1 text-sm'>
                          {atividade.detalhes}
                        </p>
                      )}
                      {atividade.ip && (
                        <p className='text-muted-foreground mt-1 text-xs'>
                          IP: {atividade.ip}
                        </p>
                      )}
                    </div>
                  </div>
                ))} */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value='configuracoes' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Settings className='h-5 w-5' />
                Configurações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4'>
                <div className='flex items-center justify-between rounded-lg border p-3'>
                  <div>
                    <p className='font-medium'>Notificações por Email</p>
                    <p className='text-muted-foreground text-sm'>
                      Receber notificações via email
                    </p>
                  </div>
                  {/* {user.configuracoes.notificacoes_email ? (
                    <CheckCircle className='h-5 w-5 text-green-500' />
                  ) : (
                    <XCircle className='h-5 w-5 text-red-500' />
                  )} */}
                </div>
                <div className='flex items-center justify-between rounded-lg border p-3'>
                  <div>
                    <p className='font-medium'>Notificações por SMS</p>
                    <p className='text-muted-foreground text-sm'>
                      Receber notificações via SMS
                    </p>
                  </div>
                  {/* {user.configuracoes.notificacoes_sms ? (
                    <CheckCircle className='h-5 w-5 text-green-500' />
                  ) : (
                    <XCircle className='h-5 w-5 text-red-500' />
                  )} */}
                </div>
                <div className='flex items-center justify-between rounded-lg border p-3'>
                  <div>
                    <p className='font-medium'>Tema</p>
                    <p className='text-muted-foreground text-sm'>
                      Preferência de tema da interface
                    </p>
                  </div>
                  {/* <Badge variant='outline'>{user.configuracoes.tema}</Badge> */}
                </div>
                <div className='flex items-center justify-between rounded-lg border p-3'>
                  <div>
                    <p className='font-medium'>Idioma</p>
                    <p className='text-muted-foreground text-sm'>
                      Idioma da interface
                    </p>
                  </div>
                  {/* <Badge variant='outline'>{user.configuracoes.idioma}</Badge> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Tab (Students only) */}
        {/* {hasAccess('student', user) && (
          <TabsContent value='academico' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <GraduationCap className='h-5 w-5' />
                    Progresso Acadêmico
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <div className='mb-2 flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        Rank Atual
                      </span>
                      <Badge variant='default'>
                        {(user as any).graduacao_atual}
                      </Badge>
                    </div>
                    <div className='mb-2 flex items-center justify-between'>
                      <span className='text-muted-foreground text-sm'>
                        Próxima Rank
                      </span>
                      <span className='text-sm'>
                        {(user as any).proxima_graduacao}
                      </span>
                    </div>
                    <Progress
                      value={(user as any).progresso_faixa}
                      className='h-2'
                    />
                    <p className='text-muted-foreground mt-1 text-xs'>
                      {(user as any).progresso_faixa}% concluído
                    </p>
                  </div>
                  <Separator />
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <p className='text-muted-foreground'>Modalidade</p>
                      <p className='font-medium'>
                        {(user as any).modalidade_principal}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>Instrutor</p>
                      <p className='font-medium'>
                        {(user as any).instrutor_principal}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>Frequência Média</p>
                      <p className='font-medium'>
                        {(user as any).frequencia_media}%
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>Data de Início</p>
                      <p className='font-medium'>
                        {new Date((user as any).data_inicio).toLocaleDateString(
                          'pt-BR'
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <CreditCard className='h-5 w-5' />
                    Situação Financeira
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>
                      Status do Pagamento
                    </span>
                    <Badge
                      variant={
                        (user as any).pagamento_status === 'Em dia'
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {(user as any).pagamento_status}
                    </Badge>
                  </div>
                  <div className='grid grid-cols-1 gap-3 text-sm'>
                    <div>
                      <p className='text-muted-foreground'>
                        Última Mensalidade
                      </p>
                      <p className='font-medium'>
                        {new Date(
                          (user as any).ultima_mensalidade
                        ).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>
                        Próxima Mensalidade
                      </p>
                      <p className='font-medium'>
                        {new Date(
                          (user as any).proxima_mensalidade
                        ).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <History className='h-5 w-5' />
                  Histórico de Ranks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {(user as any).historico_graduacoes.map(
                    (graduacao: any, index: number) => (
                      <div
                        key={index}
                        className='flex items-center gap-4 rounded-lg border p-3'
                      >
                        <Award className='h-5 w-5 text-yellow-500' />
                        <div className='flex-1'>
                          <p className='font-medium'>{graduacao.graduacao}</p>
                          <p className='text-muted-foreground text-sm'>
                            {new Date(graduacao.data).toLocaleDateString(
                              'pt-BR'
                            )}{' '}
                            - Instrutor: {graduacao.instrutor}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )} */}

        {/* Professional Tab (Instructors only) */}
        {/* {hasAccess('instructor', user) && (
          <TabsContent value='profissional' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <GraduationCap className='h-5 w-5' />
                    Qualificações
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <p className='text-muted-foreground text-sm'>Rank</p>
                    <p className='text-lg font-medium'>
                      {(user as any).graduacao}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground text-sm'>Experiência</p>
                    <p className='font-medium'>{(user as any).experiencia}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground mb-2 text-sm'>
                      Especialidades
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {(user as any).especialidades.map(
                        (esp: string, index: number) => (
                          <Badge key={index} variant='secondary'>
                            {esp}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Users className='h-5 w-5' />
                    Estatísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='text-center'>
                      <p className='text-2xl font-bold text-blue-600'>
                        {(user as any).turmas_ativas}
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        Turmas Ativas
                      </p>
                    </div>
                    <div className='text-center'>
                      <p className='text-2xl font-bold text-green-600'>
                        {(user as any).total_alunos}
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        Total de Alunos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Award className='h-5 w-5' />
                  Certificações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-3'>
                  {(user as any).certificacoes.map(
                    (cert: string, index: number) => (
                      <div
                        key={index}
                        className='flex items-center gap-3 rounded-lg border p-3'
                      >
                        <Award className='h-5 w-5 text-yellow-500' />
                        <span className='font-medium'>{cert}</span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )} */}
      </Tabs>
    </div>
  );
}
