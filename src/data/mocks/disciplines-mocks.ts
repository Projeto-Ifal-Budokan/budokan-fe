export type Discipline = {
  id: string;
  name: string;
  description: string | null;
};

// Mock data
export const mockDisciplines: Discipline[] = [
  {
    id: 'discipline-1',
    name: 'Karate-Do',
    description: 'Arte marcial japonesa focada em golpes de impacto',
  },
  {
    id: 'discipline-2',
    name: 'Kendo',
    description: 'Arte marcial japonesa que utiliza espadas de bambu',
  },
  {
    id: 'discipline-3',
    name: 'Kyudo',
    description: 'Arte marcial japonesa de arco e flecha',
  },
];
