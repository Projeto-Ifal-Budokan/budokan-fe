import { Discipline, mockDisciplines } from "./disciplines-mocks";

export type Class = {
  id: string;
  discipline: Discipline;
  date: Date;
  sessionTime: string;
  notes: string | null;
  createdAt: Date;
};

export const mockClasses: Class[] = [
  {
    id: 'class-1',
    discipline: mockDisciplines[0],
    date: new Date(2023, 10, 15),
    sessionTime: '07:00 - 08:00',
    notes: 'Introdução a kata básico',
    createdAt: new Date(2023, 10, 14),
  },
  {
    id: 'class-2',
    discipline: mockDisciplines[1],
    date: new Date(2023, 10, 16),
    sessionTime: '20:00 - 21:30',
    notes: 'Prática de kihon',
    createdAt: new Date(2023, 10, 15),
  },
  {
    id: 'class-3',
    discipline: mockDisciplines[2],
    date: new Date(2023, 10, 17),
    sessionTime: '18:50 - 19:50',
    notes: null,
    createdAt: new Date(2023, 10, 16),
  },
];
