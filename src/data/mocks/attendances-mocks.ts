import { Student, mockStudents } from "./students-mocks"

export type AttendanceRecord = {
  id: string
  student: Student
  classId: string
  status: "present" | "absent"
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export const mockAttendanceRecords: AttendanceRecord[] = [
    // Class 1 - Karate-Do
    {
      id: "att-1",
      student: mockStudents[0], // Ana - enrolled in Karate-Do
      classId: "class-1",
      status: "present",
      notes: null,
      createdAt: new Date(2023, 10, 15),
      updatedAt: new Date(2023, 10, 15),
    },
    {
      id: "att-2",
      student: mockStudents[1], // Bruno - enrolled in Karate-Do
      classId: "class-1",
      status: "present",
      notes: null,
      createdAt: new Date(2023, 10, 15),
      updatedAt: new Date(2023, 10, 15),
    },
    {
      id: "att-3",
      student: mockStudents[4], // Elena - enrolled in Karate-Do
      classId: "class-1",
      status: "absent",
      notes: "Avisou com antecedência",
      createdAt: new Date(2023, 10, 15),
      updatedAt: new Date(2023, 10, 15),
    },
  
    // Class 2 - Kendo
    {
      id: "att-4",
      student: mockStudents[2], // Carla - enrolled in Kendo
      classId: "class-2",
      status: "present",
      notes: null,
      createdAt: new Date(2023, 10, 16),
      updatedAt: new Date(2023, 10, 16),
    },
    {
      id: "att-5",
      student: mockStudents[3], // Daniel - enrolled in Kendo
      classId: "class-2",
      status: "present",
      notes: null,
      createdAt: new Date(2023, 10, 16),
      updatedAt: new Date(2023, 10, 16),
    },
    {
      id: "att-6",
      student: mockStudents[4], // Elena - enrolled in Kendo
      classId: "class-2",
      status: "present",
      notes: null,
      createdAt: new Date(2023, 10, 16),
      updatedAt: new Date(2023, 10, 16),
    },
  
    // Class 3 - Kyudo
    {
      id: "att-7",
      student: mockStudents[0], // Ana - enrolled in Kyudo
      classId: "class-3",
      status: "absent",
      notes: "Atestado médico",
      createdAt: new Date(2023, 10, 17),
      updatedAt: new Date(2023, 10, 17),
    },
    {
      id: "att-8",
      student: mockStudents[2], // Carla - enrolled in Kyudo
      classId: "class-3",
      status: "present",
      notes: null,
      createdAt: new Date(2023, 10, 17),
      updatedAt: new Date(2023, 10, 17),
    },
  ]