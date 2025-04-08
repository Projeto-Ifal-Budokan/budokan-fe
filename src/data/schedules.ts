export interface ScheduleItem {
  days: string;
  time: string | string[];
}

export interface Modality {
  name: string;
  schedules: ScheduleItem[];
  levels: string[];
}

export const modalitiesSchedules: Modality[] = [
  {
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
          '16:00 às 17:00',
          '17:00 às 18:00',
          '18:30 às 19:30',
          '19:30 às 20:30',
        ],
      },
      {
        days: 'Sexta-feira',
        time: [
          '07:00 às 08:00',
          '16:00 às 17:00',
          '17:00 às 18:00',
          '18:30 às 19:30',
          '19:30 às 20:30',
        ],
      },
    ],
    levels: ['Infantil', 'Juvenil', 'Adulto'],
  },
  {
    name: 'Kendo',
    schedules: [
      {
        days: 'Terça-feira',
        time: '20:00 - 21:30',
      },
      {
        days: 'Quinta-feira',
        time: '20:00 - 21:30',
      },
    ],
    levels: ['Iniciantes', 'Intermediários', 'Avançados'],
  },
  {
    name: 'Arquearia',
    schedules: [
      {
        days: 'Terça-feira',
        time: '18:50 - 19:50',
      },
      {
        days: 'Quinta-feira',
        time: '18:50 - 19:50',
      },
    ],
    levels: ['Iniciantes', 'Intermediários'],
  },
];
