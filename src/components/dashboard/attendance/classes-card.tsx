// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Search } from 'lucide-react';
// import { Class, mockClasses } from '@/data/mocks/classes-mocks'
// import { useState } from 'react';

// export const ClassesCard = () => {

//   // State for classes and attendance records
//   const [classes, setClasses] = useState<Class[]>(mockClasses);

//   // Apply filters to classes
//   const filteredClasses = classes.filter((cls) => {
//     // Filter by discipline
//     if (
//       filters.discipline &&
//       filters.discipline !== 'all' &&
//       cls.discipline.id !== filters.discipline
//     ) {
//       return false;
//     }

//     // Filter by date range
//     if (filters.dateRange.from && cls.date < filters.dateRange.from) {
//       return false;
//     }
//     if (filters.dateRange.to) {
//       const toDateEnd = new Date(filters.dateRange.to);
//       toDateEnd.setHours(23, 59, 59, 999);
//       if (cls.date > toDateEnd) {
//         return false;
//       }
//     }

//     return true;
//   });

//   return (
//     <Card className='border-border/40 border shadow-sm'>
//       <CardHeader className='pb-3'>
//         <div className='flex items-center justify-between'>
//           <CardTitle className='text-lg font-medium'>
//             Aulas
//             {filteredClasses.length > 0 && (
//               <Badge variant='secondary' className='ml-2'>
//                 {filteredClasses.length}
//               </Badge>
//             )}
//           </CardTitle>
//           <div className='flex items-center space-x-2'>
//             <div className='relative'>
//               <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
//               <Input
//                 type='search'
//                 placeholder='Buscar aulas...'
//                 className='h-9 w-[200px] pl-8 lg:w-[250px]'
//               />
//             </div>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className='p-0'>
//         <div className='rounded-md border-0'>
//           <Table>
//             <TableHeader>
//               <TableRow className='bg-muted/50 hover:bg-muted/50'>
//                 <TableHead className='font-medium'>Modalidade</TableHead>
//                 <TableHead className='font-medium'>Data</TableHead>
//                 <TableHead className='font-medium'>Alunos Presentes</TableHead>
//                 <TableHead className='font-medium'>Observações</TableHead>
//                 <TableHead className='w-[100px] font-medium'>Ações</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredClasses.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={5}
//                     className='text-muted-foreground h-24 text-center'
//                   >
//                     Nenhuma aula encontrada.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredClasses.map((cls) => {
//                   const classAttendance = getClassAttendanceRecords(cls.id);
//                   const presentCount = classAttendance.filter(
//                     (record) => record.status === 'present'
//                   ).length;
//                   const totalCount = classAttendance.length;
//                   const attendancePercentage =
//                     totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

//                   return (
//                     <TableRow key={cls.id} className='hover:bg-muted/30'>
//                       <TableCell className='font-medium'>
//                         {cls.discipline.name}
//                       </TableCell>
//                       <TableCell>
//                         {format(cls.date, 'dd/MM/yyyy', { locale: ptBR })}
//                       </TableCell>
//                       <TableCell>
//                         <div className='flex items-center space-x-2'>
//                           <div className='bg-muted h-2.5 w-full max-w-[100px] rounded-full'>
//                             <div
//                               className={cn('h-2.5 rounded-full', {
//                                 'bg-green-500': attendancePercentage >= 75,
//                                 'bg-yellow-500':
//                                   attendancePercentage >= 50 &&
//                                   attendancePercentage < 75,
//                                 'bg-red-500': attendancePercentage < 50,
//                               })}
//                               style={{ width: `${attendancePercentage}%` }}
//                             ></div>
//                           </div>
//                           <span className='text-sm'>
//                             {presentCount}/{totalCount}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className='max-w-[200px] truncate'>
//                         {cls.notes || (
//                           <span className='text-muted-foreground'>-</span>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           variant='outline'
//                           size='sm'
//                           onClick={() => handleManageAttendance(cls)}
//                           className='h-8 w-full'
//                         >
//                           Gerenciar
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };
