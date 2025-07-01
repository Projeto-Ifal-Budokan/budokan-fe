'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInstructorDisciplines } from '@/lib/api/queries/use-instructor-disciplines';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  GraduationCap,
  Star,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface InstructorDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function InstructorDetailPage({
  params,
}: InstructorDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { useInstructorDiscipline } = useInstructorDisciplines();

  const { data: instructor, isLoading, error } = useInstructorDiscipline(id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      default:
        return 'Desconhecido';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name;
  };

  if (isLoading) {
    return (
      <div className='flex min-h-screen flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='text-center'>
          <div className='relative'>
            <div className='h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600' />
            <div className='absolute inset-0 h-16 w-16 animate-pulse rounded-full bg-blue-100' />
          </div>
          <p className='mt-4 text-lg font-medium text-gray-700'>
            Carregando perfil do instrutor...
          </p>
        </div>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <div className='mx-auto max-w-md text-center'>
          <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100'>
            <AlertTriangle className='h-10 w-10 text-red-600' />
          </div>
          <h3 className='mb-2 text-2xl font-bold text-gray-900'>
            Instrutor não encontrado
          </h3>
          <p className='mb-6 text-gray-600'>
            O instrutor solicitado não existe ou foi removido do sistema.
          </p>
          <Button
            onClick={() => router.back()}
            size='lg'
            className='shadow-lg transition-all duration-300 hover:shadow-xl'
          >
            <ArrowLeft className='mr-2 h-5 w-5' />
            Voltar para Lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      <div className='container mx-auto space-y-8 px-4 py-6'>
        {/* Enhanced Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-6'>
            <Button
              variant='ghost'
              size='lg'
              onClick={() => router.back()}
              className='shadow-sm transition-all duration-300 hover:bg-white/80'
            >
              <ArrowLeft className='mr-2 h-5 w-5' />
              Voltar
            </Button>
            <div>
              <h1 className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent'>
                Perfil do Instrutor
              </h1>
              <p className='text-lg text-gray-600'>
                Informações detalhadas e atividades
              </p>
            </div>
          </div>
          <Button
            size='lg'
            className='bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
          >
            <Edit className='mr-2 h-5 w-5' />
            Editar Perfil
          </Button>
        </div>

        {/* Enhanced Instructor Header Card */}
        <Card className='overflow-hidden border-0 bg-gradient-to-r from-white to-blue-50/50 shadow-xl'>
          <CardContent className='p-8'>
            <div className='flex items-start gap-8'>
              <div className='relative'>
                <Avatar className='h-32 w-32 shadow-2xl ring-4 ring-white'>
                  <AvatarFallback className='bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-2xl font-bold text-white'>
                    {getInitials(instructor.instructorName)}
                  </AvatarFallback>
                </Avatar>
                <div className='absolute -right-2 -bottom-2 rounded-full bg-green-500 p-2 shadow-lg'>
                  <CheckCircle className='h-4 w-4 text-white' />
                </div>
              </div>

              <div className='flex-1'>
                <div className='mb-4 flex items-center gap-4'>
                  <h2 className='text-3xl font-bold text-gray-900'>
                    {instructor.instructorName}
                  </h2>
                  <Badge
                    variant={getStatusColor(instructor.status)}
                    className='px-3 py-1 text-sm shadow-sm'
                  >
                    {getStatusText(instructor.status)}
                  </Badge>
                </div>

                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-3'>
                      <div className='rounded-full bg-blue-100 p-2'>
                        <Users className='h-4 w-4 text-blue-600' />
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>ID do Instrutor</p>
                        <p className='font-semibold text-gray-900'>
                          {instructor.id}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3'>
                      <div className='rounded-full bg-emerald-100 p-2'>
                        <GraduationCap className='h-4 w-4 text-emerald-600' />
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Disciplina</p>
                        <p className='font-semibold text-gray-900'>
                          {instructor.disciplineName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50/50 p-3'>
                      <div className='rounded-full bg-amber-100 p-2'>
                        <Award className='h-4 w-4 text-amber-600' />
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Graduação</p>
                        <p className='font-semibold text-gray-900'>
                          {instructor.rankName}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3 rounded-lg border border-purple-100 bg-purple-50/50 p-3'>
                      <div className='rounded-full bg-purple-100 p-2'>
                        <Calendar className='h-4 w-4 text-purple-600' />
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Membro desde</p>
                        <p className='font-semibold text-gray-900'>
                          {formatDate(instructor.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tabs */}
        <Tabs defaultValue='geral' className='space-y-6'>
          <TabsList className='grid h-14 w-full grid-cols-4 rounded-xl border-0 bg-white p-1 shadow-lg'>
            <TabsTrigger
              value='geral'
              className='rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg'
            >
              Geral
            </TabsTrigger>
            <TabsTrigger
              value='disciplinas'
              className='rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg'
            >
              Disciplinas
            </TabsTrigger>
            <TabsTrigger
              value='atividades'
              className='rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg'
            >
              Atividades
            </TabsTrigger>
            <TabsTrigger
              value='historico'
              className='rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg'
            >
              Histórico
            </TabsTrigger>
          </TabsList>

          {/* Enhanced General Tab */}
          <TabsContent value='geral' className='space-y-6'>
            <div className='grid gap-6 lg:grid-cols-2'>
              <Card className='border-0 bg-gradient-to-br from-white to-slate-50 shadow-lg transition-all duration-300 hover:shadow-xl'>
                <CardHeader className='pb-4'>
                  <CardTitle className='flex items-center gap-3 text-xl'>
                    <div className='rounded-full bg-blue-100 p-2'>
                      <User className='h-5 w-5 text-blue-600' />
                    </div>
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='space-y-4'>
                    <div className='group rounded-lg p-3 transition-all duration-300 hover:bg-blue-50/50'>
                      <label className='mb-1 block text-sm font-medium text-gray-600'>
                        Nome Completo
                      </label>
                      <p className='text-lg font-semibold text-gray-900'>
                        {instructor.instructorName}
                      </p>
                    </div>

                    <div className='group rounded-lg p-3 transition-all duration-300 hover:bg-blue-50/50'>
                      <label className='mb-1 block text-sm font-medium text-gray-600'>
                        ID do Instrutor
                      </label>
                      <p className='inline-block rounded bg-gray-100 px-2 py-1 font-mono font-semibold text-gray-900'>
                        {instructor.idInstructor}
                      </p>
                    </div>

                    <div className='group rounded-lg p-3 transition-all duration-300 hover:bg-blue-50/50'>
                      <label className='mb-2 block text-sm font-medium text-gray-600'>
                        Status
                      </label>
                      <Badge
                        variant={getStatusColor(instructor.status)}
                        className='px-3 py-1 text-sm shadow-sm'
                      >
                        {getStatusText(instructor.status)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='border-0 bg-gradient-to-br from-white to-emerald-50 shadow-lg transition-all duration-300 hover:shadow-xl'>
                <CardHeader className='pb-4'>
                  <CardTitle className='flex items-center gap-3 text-xl'>
                    <div className='rounded-full bg-emerald-100 p-2'>
                      <GraduationCap className='h-5 w-5 text-emerald-600' />
                    </div>
                    Informações Acadêmicas
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='space-y-4'>
                    <div className='group rounded-lg p-3 transition-all duration-300 hover:bg-emerald-50/50'>
                      <label className='mb-1 block text-sm font-medium text-gray-600'>
                        Disciplina
                      </label>
                      <p className='text-lg font-semibold text-gray-900'>
                        {instructor.disciplineName}
                      </p>
                    </div>

                    <div className='group rounded-lg p-3 transition-all duration-300 hover:bg-emerald-50/50'>
                      <label className='mb-1 block text-sm font-medium text-gray-600'>
                        Graduação/Rank
                      </label>
                      <div className='flex items-center gap-2'>
                        <Award className='h-4 w-4 text-amber-500' />
                        <p className='text-lg font-semibold text-gray-900'>
                          {instructor.rankName}
                        </p>
                      </div>
                    </div>

                    <div className='group rounded-lg p-3 transition-all duration-300 hover:bg-emerald-50/50'>
                      <label className='mb-1 block text-sm font-medium text-gray-600'>
                        ID da Disciplina
                      </label>
                      <p className='inline-block rounded bg-gray-100 px-2 py-1 font-mono font-semibold text-gray-900'>
                        {instructor.idDiscipline}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className='grid gap-4 md:grid-cols-3'>
              <Card className='border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transition-all duration-300 hover:shadow-xl'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-blue-100'>
                        Total de Alunos
                      </p>
                      <p className='text-3xl font-bold'>42</p>
                    </div>
                    <Users className='h-8 w-8 text-blue-200' />
                  </div>
                </CardContent>
              </Card>

              <Card className='border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg transition-all duration-300 hover:shadow-xl'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-emerald-100'>
                        Aulas Ministradas
                      </p>
                      <p className='text-3xl font-bold'>128</p>
                    </div>
                    <BookOpen className='h-8 w-8 text-emerald-200' />
                  </div>
                </CardContent>
              </Card>

              <Card className='border-0 bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg transition-all duration-300 hover:shadow-xl'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-amber-100'>
                        Avaliação Média
                      </p>
                      <p className='text-3xl font-bold'>4.8</p>
                    </div>
                    <Star className='h-8 w-8 text-amber-200' />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Disciplines Tab */}
          <TabsContent value='disciplinas' className='space-y-6'>
            <Card className='border-0 bg-gradient-to-br from-white to-emerald-50 shadow-lg'>
              <CardHeader className='pb-4'>
                <CardTitle className='text-2xl'>
                  Disciplinas Lecionadas
                </CardTitle>
                <p className='text-gray-600'>
                  Especialidades e graduações do instrutor
                </p>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='rounded-xl border-0 bg-gradient-to-r from-emerald-50 to-blue-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 shadow-lg'>
                          <GraduationCap className='h-8 w-8 text-white' />
                        </div>
                        <div>
                          <h3 className='text-xl font-bold text-gray-900'>
                            {instructor.disciplineName}
                          </h3>
                          <div className='mt-1 flex items-center gap-2'>
                            <Award className='h-4 w-4 text-amber-500' />
                            <p className='font-medium text-gray-600'>
                              Graduação: {instructor.rankName}
                            </p>
                          </div>
                          <p className='mt-1 text-sm text-gray-500'>
                            Especialista certificado
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <Badge
                          variant={getStatusColor(instructor.status)}
                          className='mb-2 shadow-sm'
                        >
                          {getStatusText(instructor.status)}
                        </Badge>
                        <p className='text-sm text-gray-500'>
                          Desde {formatDate(instructor.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Activities Tab */}
          <TabsContent value='atividades' className='space-y-6'>
            <Card className='border-0 bg-gradient-to-br from-white to-blue-50 shadow-lg'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-3 text-2xl'>
                  <div className='rounded-full bg-blue-100 p-2'>
                    <Activity className='h-6 w-6 text-blue-600' />
                  </div>
                  Atividades Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='py-16 text-center'>
                  <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100'>
                    <TrendingUp className='h-12 w-12 text-blue-500' />
                  </div>
                  <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                    Área de Atividades
                  </h3>
                  <p className='mx-auto max-w-md leading-relaxed text-gray-600'>
                    Aqui serão exibidas as atividades recentes do instrutor,
                    incluindo aulas ministradas, avaliações e interações com
                    alunos.
                  </p>
                  <Button className='mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'>
                    <Activity className='mr-2 h-4 w-4' />
                    Ver Todas as Atividades
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced History Tab */}
          <TabsContent value='historico' className='space-y-6'>
            <Card className='border-0 bg-gradient-to-br from-white to-purple-50 shadow-lg'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-3 text-2xl'>
                  <div className='rounded-full bg-purple-100 p-2'>
                    <Clock className='h-6 w-6 text-purple-600' />
                  </div>
                  Histórico do Instrutor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  <div className='relative'>
                    <div className='absolute top-8 bottom-0 left-6 w-0.5 bg-gradient-to-b from-blue-400 to-purple-400' />

                    <div className='relative flex gap-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm transition-all duration-300 hover:shadow-md'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg'>
                        <Calendar className='h-6 w-6 text-white' />
                      </div>
                      <div className='flex-1'>
                        <div className='mb-2 flex items-center gap-3'>
                          <span className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700'>
                            {formatDate(instructor.createdAt)}
                          </span>
                        </div>
                        <h4 className='mb-1 text-lg font-semibold text-gray-900'>
                          Instrutor cadastrado no sistema
                        </h4>
                        <p className='text-gray-600'>
                          Associado à disciplina{' '}
                          <span className='font-semibold'>
                            {instructor.disciplineName}
                          </span>{' '}
                          com graduação{' '}
                          <span className='font-semibold'>
                            {instructor.rankName}
                          </span>
                        </p>
                      </div>
                    </div>

                    {instructor.updatedAt &&
                      instructor.updatedAt !== instructor.createdAt && (
                        <div className='relative mt-4 flex gap-6 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 p-6 shadow-sm transition-all duration-300 hover:shadow-md'>
                          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg'>
                            <CheckCircle className='h-6 w-6 text-white' />
                          </div>
                          <div className='flex-1'>
                            <div className='mb-2 flex items-center gap-3'>
                              <span className='rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700'>
                                {formatDate(instructor.updatedAt)}
                              </span>
                            </div>
                            <h4 className='mb-1 text-lg font-semibold text-gray-900'>
                              Última atualização
                            </h4>
                            <p className='text-gray-600'>
                              Informações do perfil foram atualizadas no sistema
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
