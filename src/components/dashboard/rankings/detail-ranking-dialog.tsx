'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Ranking } from '@/types/ranking';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, Edit, Trophy, Users } from 'lucide-react';

interface RankingDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ranking: Ranking;
}

export function RankingDetailDialog({
  open,
  onOpenChange,
  ranking,
}: RankingDetailDialogProps) {
  const getBeltColor = (description: string) => {
    const colorMap: { [key: string]: string } = {
      'Faixa Branca': 'bg-gray-100 text-gray-800',
      'Faixa Amarela': 'bg-yellow-100 text-yellow-800',
      'Faixa Laranja': 'bg-orange-100 text-orange-800',
      'Faixa Verde': 'bg-green-100 text-green-800',
      'Faixa Roxa': 'bg-purple-100 text-purple-800',
      'Faixa Marrom': 'bg-amber-100 text-amber-800',
      'Faixa Preta': 'bg-gray-900 text-white',
      'Faixa Azul': 'bg-blue-100 text-blue-800',
    };
    return colorMap[description] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    } catch {
      return 'Data inválida';
    }
  };

  // Mock data for ranking statistics
  const rankingStats = {
    totalStudents: Math.floor(Math.random() * 50) + 1,
    activeStudents: Math.floor(Math.random() * 30) + 1,
    lastExam: formatDate(new Date().toISOString()),
    nextExam: formatDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    ),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Trophy className='h-5 w-5 text-blue-600' />
            Detalhes do Ranking
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre o ranking selecionado.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Ranking Info */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-xl font-semibold text-gray-900'>
                  {ranking.name}
                </h3>
                <p className='text-gray-600'>{ranking.description}</p>
              </div>
              <Badge className={`${getBeltColor(ranking.description)}`}>
                {ranking.description}
              </Badge>
            </div>

            <div className='flex items-center space-x-2'>
              <Badge variant='outline'>{ranking.disciplineName}</Badge>
            </div>
          </div>

          <Separator />

          {/* Statistics */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <Users className='h-4 w-4 text-blue-600' />
                <span className='text-sm font-medium text-gray-700'>
                  Total de Alunos
                </span>
              </div>
              <p className='text-2xl font-bold text-gray-900'>
                {rankingStats.totalStudents}
              </p>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <Users className='h-4 w-4 text-green-600' />
                <span className='text-sm font-medium text-gray-700'>
                  Alunos Ativos
                </span>
              </div>
              <p className='text-2xl font-bold text-gray-900'>
                {rankingStats.activeStudents}
              </p>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div className='space-y-4'>
            <h4 className='font-medium text-gray-900'>Histórico</h4>

            <div className='space-y-3'>
              <div className='flex items-center space-x-3'>
                <Calendar className='h-4 w-4 text-gray-400' />
                <div>
                  <p className='text-sm font-medium text-gray-700'>Criado em</p>
                  <p className='text-sm text-gray-600'>
                    {formatDate(ranking.createdAt)}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <Clock className='h-4 w-4 text-gray-400' />
                <div>
                  <p className='text-sm font-medium text-gray-700'>
                    Última atualização
                  </p>
                  <p className='text-sm text-gray-600'>
                    {formatDate(ranking.updatedAt)}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <Calendar className='h-4 w-4 text-gray-400' />
                <div>
                  <p className='text-sm font-medium text-gray-700'>
                    Último exame
                  </p>
                  <p className='text-sm text-gray-600'>
                    {rankingStats.lastExam}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <Calendar className='h-4 w-4 text-blue-400' />
                <div>
                  <p className='text-sm font-medium text-gray-700'>
                    Próximo exame
                  </p>
                  <p className='text-sm text-gray-600'>
                    {rankingStats.nextExam}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Info */}
          <div className='space-y-4'>
            <h4 className='font-medium text-gray-900'>
              Informações Adicionais
            </h4>

            <div className='grid grid-cols-1 gap-4'>
              <div className='rounded-lg border p-4'>
                <h5 className='mb-2 font-medium text-gray-700'>
                  Requisitos para Graduação
                </h5>
                <ul className='space-y-1 text-sm text-gray-600'>
                  <li>• Mínimo de 6 meses no ranking atual</li>
                  <li>• Frequência mínima de 75%</li>
                  <li>• Aprovação no exame prático</li>
                  <li>• Aprovação no exame teórico</li>
                </ul>
              </div>

              <div className='rounded-lg border p-4'>
                <h5 className='mb-2 font-medium text-gray-700'>
                  Programa do Exame
                </h5>
                <ul className='space-y-1 text-sm text-gray-600'>
                  <li>• Kata específico do ranking</li>
                  <li>• Kumite (combate)</li>
                  <li>• Kihon (técnicas básicas)</li>
                  <li>• Conhecimento teórico</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button className='bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-blue-950'>
            <Edit className='mr-2 h-4 w-4' />
            Editar Ranking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
