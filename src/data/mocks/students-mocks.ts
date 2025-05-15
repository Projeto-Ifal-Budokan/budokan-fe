export type Student = {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  enrolledDisciplines: string[]; // IDs of disciplines the student is enrolled in
};

export const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    profilePicture: '/placeholder.svg?height=40&width=40',
    enrolledDisciplines: ['discipline-1', 'discipline-3'],
  },
  {
    id: 'student-2',
    name: 'Bruno Oliveira',
    email: 'bruno.oliveira@email.com',
    profilePicture: '/placeholder.svg?height=40&width=40',
    enrolledDisciplines: ['discipline-1'],
  },
  {
    id: 'student-3',
    name: 'Carla Santos',
    email: 'carla.santos@email.com',
    profilePicture: '/placeholder.svg?height=40&width=40',
    enrolledDisciplines: ['discipline-2', 'discipline-3'],
  },
  {
    id: 'student-4',
    name: 'Daniel Pereira',
    email: 'daniel.pereira@email.com',
    profilePicture: '/placeholder.svg?height=40&width=40',
    enrolledDisciplines: ['discipline-2'],
  },
  {
    id: 'student-5',
    name: 'Elena Costa',
    email: 'elena.costa@email.com',
    profilePicture: '/placeholder.svg?height=40&width=40',
    enrolledDisciplines: ['discipline-1', 'discipline-2'],
  },
];
