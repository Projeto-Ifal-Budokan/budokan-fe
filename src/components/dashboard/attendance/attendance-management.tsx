"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, CalendarIcon, Search, Check, X, Filter, ChevronDown } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Class, mockClasses } from "@/data/mocks/classes-mocks"
import { Discipline, mockDisciplines } from "@/data/mocks/disciplines-mocks"
import { Student, mockStudents } from "@/data/mocks/students-mocks"
import { AttendanceRecord, mockAttendanceRecords } from "@/data/mocks/attendances-mocks"

export type FilterState = {
  discipline: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
}

export function AttendanceManagement() {
  // State for classes and attendance records
  const [classes, setClasses] = useState<Class[]>(mockClasses)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords)
  const [disciplines] = useState<Discipline[]>(mockDisciplines)
  const [students] = useState<Student[]>(mockStudents)

  // State for dialogs
  const [isNewClassDialogOpen, setIsNewClassDialogOpen] = useState(false)
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)

  // State for new class form
  const [newClass, setNewClass] = useState({
    disciplineId: "",
    date: new Date(),
    sessionTime: "",
    notes: "",
  })

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    discipline: "",
    dateRange: { from: undefined, to: undefined },
  })

  // State for filter visibility
  const [showFilters, setShowFilters] = useState(false)

  // Check if any filters are active
  const hasActiveFilters = filters.discipline !== "" || filters.dateRange.from !== undefined

  // Apply filters to classes
  const filteredClasses = classes.filter((cls) => {
    // Filter by discipline
    if (filters.discipline && filters.discipline !== "all" && cls.discipline.id !== filters.discipline) {
      return false
    }

    // Filter by date range
    if (filters.dateRange.from && cls.date < filters.dateRange.from) {
      return false
    }
    if (filters.dateRange.to) {
      const toDateEnd = new Date(filters.dateRange.to)
      toDateEnd.setHours(23, 59, 59, 999)
      if (cls.date > toDateEnd) {
        return false
      }
    }

    return true
  })

  // Handle creating a new class
  const handleCreateClass = () => {
    // Create a new class
    const newClassId = `class-${Date.now()}`
    const classToAdd: Class = {
      id: newClassId,
      discipline: disciplines.find((d) => d.id === newClass.disciplineId)!,
      date: newClass.date,
      sessionTime: newClass.sessionTime,
      notes: newClass.notes || null,
      createdAt: new Date(),
    }
    setClasses([...classes, classToAdd])

    // Create attendance records for all students enrolled in this discipline
    const enrolledStudents = students.filter((student) => student.enrolledDisciplines.includes(newClass.disciplineId))

    const newAttendanceRecords = enrolledStudents.map((student) => ({
      id: `att-${Date.now()}-${student.id}`,
      student,
      classId: newClassId,
      status: "present" as const, // Default to present
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    setAttendanceRecords([...attendanceRecords, ...newAttendanceRecords])
    setIsNewClassDialogOpen(false)
    resetNewClassForm()
  }

  // Reset new class form
  const resetNewClassForm = () => {
    setNewClass({
      disciplineId: "",
      date: new Date(),
      sessionTime: "",
      notes: "",
    })
  }

  // Handle opening attendance management for a class
  const handleManageAttendance = (cls: Class) => {
    setSelectedClass(cls)
    setIsAttendanceDialogOpen(true)
  }

  // Handle deleting a class
  const handleDeleteClass = (classId: string) => {
    setClasses(classes.filter((cls) => cls.id !== classId))
    // Also delete all attendance records for this class
    setAttendanceRecords(attendanceRecords.filter((record) => record.classId !== classId))
  }

  // Handle updating attendance status
  const handleUpdateAttendanceStatus = (recordId: string, status: "present" | "absent") => {
    setAttendanceRecords(
      attendanceRecords.map((record) =>
        record.id === recordId ? { ...record, status, updatedAt: new Date() } : record,
      ),
    )
  }

  // Handle batch update of attendance status
  const handleBatchUpdateStatus = (classId: string, status: "present" | "absent") => {
    setAttendanceRecords(
      attendanceRecords.map((record) =>
        record.classId === classId ? { ...record, status, updatedAt: new Date() } : record,
      ),
    )
  }

  // Get attendance records for a specific class
  const getClassAttendanceRecords = (classId: string) => {
    return attendanceRecords.filter((record) => record.classId === classId)
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      discipline: "",
      dateRange: { from: undefined, to: undefined },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Aulas e Frequência</h2>
        <Button onClick={() => setIsNewClassDialogOpen(true)} className="bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Aula
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-border/40 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                  Ativos
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8 text-muted-foreground"
            >
              {showFilters ? "Ocultar" : "Mostrar"}{" "}
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="discipline-filter" className="text-sm font-medium">
                  Modalidade
                </Label>
                <Select
                  value={filters.discipline}
                  onValueChange={(value) => setFilters({ ...filters, discipline: value })}
                >
                  <SelectTrigger id="discipline-filter" className="h-9">
                    <SelectValue placeholder="Todas as modalidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as modalidades</SelectItem>
                    {disciplines.map((discipline) => (
                      <SelectItem key={discipline.id} value={discipline.id}>
                        {discipline.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Período</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal h-9 border-input">
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                      {filters.dateRange.from ? (
                        filters.dateRange.to ? (
                          <>
                            {format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                            {format(filters.dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                          </>
                        ) : (
                          format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                        )
                      ) : (
                        <span className="text-muted-foreground">Selecione um período</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: filters.dateRange.from,
                        to: filters.dateRange.to,
                      }}
                      onSelect={(range) =>
                        setFilters({
                          ...filters,
                          dateRange: {
                            from: range?.from,
                            to: range?.to,
                          },
                        })
                      }
                      locale={ptBR}
                      initialFocus
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" size="sm" onClick={resetFilters} className="h-8">
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Classes Table */}
      <Card className="border border-border/40 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">
              Aulas
              {filteredClasses.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filteredClasses.length}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar aulas..." className="pl-8 h-9 w-[200px] lg:w-[250px]" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-medium">Modalidade</TableHead>
                  <TableHead className="font-medium">Data</TableHead>
                  <TableHead className="font-medium">Alunos Presentes</TableHead>
                  <TableHead className="font-medium">Observações</TableHead>
                  <TableHead className="w-[100px] font-medium">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Nenhuma aula encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClasses.map((cls) => {
                    const classAttendance = getClassAttendanceRecords(cls.id)
                    const presentCount = classAttendance.filter((record) => record.status === "present").length
                    const totalCount = classAttendance.length
                    const attendancePercentage = totalCount > 0 ? (presentCount / totalCount) * 100 : 0

                    return (
                      <TableRow key={cls.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{cls.discipline.name}</TableCell>
                        <TableCell>{format(cls.date, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-full max-w-[100px] bg-muted rounded-full h-2.5">
                              <div
                                className={cn("h-2.5 rounded-full", {
                                  "bg-green-500": attendancePercentage >= 75,
                                  "bg-yellow-500": attendancePercentage >= 50 && attendancePercentage < 75,
                                  "bg-red-500": attendancePercentage < 50,
                                })}
                                style={{ width: `${attendancePercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">
                              {presentCount}/{totalCount}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {cls.notes || <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManageAttendance(cls)}
                            className="h-8 w-full"
                          >
                            Gerenciar
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Class Dialog */}
      <Dialog open={isNewClassDialogOpen} onOpenChange={setIsNewClassDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Nova Aula</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Crie uma nova aula para registrar a frequência dos alunos.
              </p>
            </div>

            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="discipline" className="text-sm font-medium">
                  Modalidade
                </Label>
                <Select
                  value={newClass.disciplineId}
                  onValueChange={(value) => setNewClass({ ...newClass, disciplineId: value })}
                >
                  <SelectTrigger id="discipline">
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplines.map((discipline) => (
                      <SelectItem key={discipline.id} value={discipline.id}>
                        {discipline.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Data da Aula</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                      {newClass.date ? (
                        format(newClass.date, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span className="text-muted-foreground">Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newClass.date}
                      onSelect={(date) => setNewClass({ ...newClass, date: date || new Date() })}
                      locale={ptBR}
                      initialFocus
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Observações (opcional)
                </Label>
                <Input
                  id="notes"
                  value={newClass.notes}
                  onChange={(e) => setNewClass({ ...newClass, notes: e.target.value })}
                  placeholder="Adicione observações sobre esta aula"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsNewClassDialogOpen(false)
                  resetNewClassForm()
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateClass}
                disabled={!newClass.disciplineId || !newClass.date}
                className="bg-primary hover:bg-primary/90"
              >
                Criar Aula
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attendance Management Dialog */}
      <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          {selectedClass && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">Gerenciar Frequência</h2>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="mr-2 font-normal">
                    {selectedClass.discipline.name}
                  </Badge>
                  <span>{format(selectedClass.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {getClassAttendanceRecords(selectedClass.id).length} alunos matriculados
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700"
                    onClick={() => handleBatchUpdateStatus(selectedClass.id, "present")}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Todos Presentes
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700"
                    onClick={() => handleBatchUpdateStatus(selectedClass.id, "absent")}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Todos Ausentes
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                {getClassAttendanceRecords(selectedClass.id).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum aluno matriculado nesta modalidade.
                  </div>
                ) : (
                  getClassAttendanceRecords(selectedClass.id).map((record) => (
                    <Card key={record.id} className="overflow-hidden border border-border/40">
                      <CardContent className="p-0">
                        <div className="flex items-center p-4">
                          <Avatar className="h-10 w-10 border">
                            <AvatarImage src={record.student.profilePicture || undefined} alt={record.student.name} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {record.student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4 flex-1">
                            <p className="font-medium">{record.student.name}</p>
                            <p className="text-sm text-muted-foreground">{record.student.email}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant={record.status === "present" ? "default" : "outline"}
                              className={cn(
                                "h-9 px-3 rounded-l-md rounded-r-none",
                                record.status === "present" && "bg-green-600 hover:bg-green-700",
                              )}
                              onClick={() => handleUpdateAttendanceStatus(record.id, "present")}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Presente
                            </Button>
                            <Button
                              size="sm"
                              variant={record.status === "absent" ? "default" : "outline"}
                              className={cn(
                                "h-9 px-3 rounded-r-md rounded-l-none",
                                record.status === "absent" && "bg-red-600 hover:bg-red-700",
                              )}
                              onClick={() => handleUpdateAttendanceStatus(record.id, "absent")}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Ausente
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button onClick={() => setIsAttendanceDialogOpen(false)} className="bg-primary hover:bg-primary/90">
                  Salvar e Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AttendanceManagement
