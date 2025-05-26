export interface ScheduleItem {
  days: string;
  time: string[];
}

export type Discipline = {
  id: string;
  name: string;
  schedules: ScheduleItem[];
  description: string | null;
};

// Mock data
export const mockDisciplines: Discipline[] = [
  {
    id: 'discipline-1',
    name: 'Karate-Do',
    schedules: [
      {
        days: 'Segunda-feira',
        time: [
          '07:00 às 08:00',
          '17:00 às 18:00',
          '18:30 às 19:30',
          '19:30 às 20:30',
        ],
      },
      {
        days: 'Quarta-feira',
        time: [
          '07:00 às 08:00',
          '17:00 às 18:00',
          '18:30 às 19:30',
          '19:30 às 20:30',
        ],
      },
      {
        days: 'Sexta-feira',
        time: [
          '07:00 às 08:00',
          '17:00 às 18:00',
          '18:30 às 19:30',
          '19:30 às 20:30',
        ],
      },
    ],
    description: 'Arte marcial japonesa focada em golpes de impacto',
  },
  {
    id: 'discipline-2',
    name: 'Kendo',
    schedules: [
      {
        days: 'Terça-feira',
        time: ['20:00 - 21:30'],
      },
      {
        days: 'Quinta-feira',
        time: ['20:00 - 21:30'],
      },
    ],
    description: 'Arte marcial japonesa que utiliza espadas de bambu',
  },
  {
    id: 'discipline-3',
    name: 'Kyudo',
    schedules: [
      {
        days: 'Terça-feira',
        time: ['18:50 - 19:50'],
      },
      {
        days: 'Quinta-feira',
        time: ['18:50 - 19:50'],
      },
    ],
    description: 'Arte marcial japonesa de arco e flecha',
  },
];
