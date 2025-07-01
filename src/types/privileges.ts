export const PRIVILEGES = {
  // Admin privilege
  ADMIN: 'admin',

  // User management
  LIST_USERS: 'list_users',
  VIEW_USER: 'view_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',

  // Role management
  LIST_ROLES: 'list_roles',
  VIEW_ROLE: 'view_role',
  CREATE_ROLE: 'create_role',
  UPDATE_ROLE: 'update_role',
  DELETE_ROLE: 'delete_role',

  // Privilege management
  LIST_PRIVILEGES: 'list_privileges',
  VIEW_PRIVILEGE: 'view_privilege',
  CREATE_PRIVILEGE: 'create_privilege',
  UPDATE_PRIVILEGE: 'update_privilege',
  DELETE_PRIVILEGE: 'delete_privilege',

  // User-Role management
  UPDATE_USER_ROLES: 'update_user_roles',
  VIEW_USER_ROLES: 'view_user_roles',

  // Role-Privilege management
  UPDATE_ROLE_PRIVILEGES: 'update_role_privileges',
  VIEW_ROLE_PRIVILEGES: 'view_role_privileges',

  // Discipline management
  LIST_DISCIPLINES: 'list_disciplines',
  VIEW_DISCIPLINE: 'view_discipline',
  CREATE_DISCIPLINE: 'create_discipline',
  UPDATE_DISCIPLINE: 'update_discipline',
  DELETE_DISCIPLINE: 'delete_discipline',

  // Rank management
  LIST_RANKS: 'list_ranks',
  VIEW_RANK: 'view_rank',
  CREATE_RANK: 'create_rank',
  UPDATE_RANK: 'update_rank',
  DELETE_RANK: 'delete_rank',

  // Matriculation management
  LIST_MATRICULATIONS: 'list_matriculations',
  VIEW_MATRICULATION: 'view_matriculation',
  CREATE_MATRICULATION: 'create_matriculation',
  UPDATE_MATRICULATION: 'update_matriculation',
  DELETE_MATRICULATION: 'delete_matriculation',

  // Instructor-Discipline management
  LIST_INSTRUCTOR_DISCIPLINES: 'list_instructor_disciplines',
  VIEW_INSTRUCTOR_DISCIPLINE: 'view_instructor_discipline',
  CREATE_INSTRUCTOR_DISCIPLINE: 'create_instructor_discipline',
  UPDATE_INSTRUCTOR_DISCIPLINE: 'update_instructor_discipline',
  DELETE_INSTRUCTOR_DISCIPLINE: 'delete_instructor_discipline',

  // Session management
  LIST_SESSIONS: 'list_sessions',
  CREATE_SESSION: 'create_session',
  UPDATE_SESSION: 'update_session',
  DELETE_SESSION: 'delete_session',

  // Attendance management
  VIEW_MATRICULATION_SESSIONS: 'view_matriculation_sessions',
  LIST_ATTENDANCES: 'list_attendances',
  CREATE_ATTENDANCE: 'create_attendance',
  UPDATE_ATTENDANCE: 'update_attendance',
  DELETE_ATTENDANCE: 'delete_attendance',

  // Daily absence management
  LIST_DAILY_ABSENCES: 'list_daily_absences',
  VIEW_DAILY_ABSENCE: 'view_daily_absence',
  CREATE_DAILY_ABSENCE: 'create_daily_absence',
  UPDATE_DAILY_ABSENCE: 'update_daily_absence',
  DELETE_DAILY_ABSENCE: 'delete_daily_absence',
  COUNT_ABSENCE_DAYS: 'count_absence_days',
  PROCESS_DAILY_ABSENCES: 'process_daily_absences',

  // Training schedule management
  LIST_TRAINING_SCHEDULES: 'list_training_schedules',
  VIEW_TRAINING_SCHEDULE: 'view_training_schedule',
  CREATE_TRAINING_SCHEDULE: 'create_training_schedule',
  UPDATE_TRAINING_SCHEDULE: 'update_training_schedule',
  DELETE_TRAINING_SCHEDULE: 'delete_training_schedule',

  // Practitioner contact management
  LIST_PRACTITIONER_CONTACTS: 'list_practitioner_contacts',
  VIEW_PRACTITIONER_CONTACT: 'view_practitioner_contact',
  CREATE_PRACTITIONER_CONTACT: 'create_practitioner_contact',
  UPDATE_PRACTITIONER_CONTACT: 'update_practitioner_contact',
  DELETE_PRACTITIONER_CONTACT: 'delete_practitioner_contact',

  // PIX key management
  LIST_PIX_KEYS: 'list_pix_keys',
  VIEW_PIX_KEY: 'view_pix_key',
  CREATE_PIX_KEY: 'create_pix_key',
  UPDATE_PIX_KEY: 'update_pix_key',
} as const;

// Type for the privilege values
export type PrivilegeType = (typeof PRIVILEGES)[keyof typeof PRIVILEGES];

// Profile-specific privilege sets
export const INSTRUCTOR_PRIVILEGES: PrivilegeType[] = [
  PRIVILEGES.LIST_USERS,
  PRIVILEGES.VIEW_USER,
  PRIVILEGES.LIST_DISCIPLINES,
  PRIVILEGES.VIEW_DISCIPLINE,
  PRIVILEGES.LIST_RANKS,
  PRIVILEGES.VIEW_RANK,
  PRIVILEGES.LIST_MATRICULATIONS,
  PRIVILEGES.VIEW_MATRICULATION,
  PRIVILEGES.LIST_INSTRUCTOR_DISCIPLINES,
  PRIVILEGES.VIEW_INSTRUCTOR_DISCIPLINE,
];

export const STUDENT_PRIVILEGES: PrivilegeType[] = [
  PRIVILEGES.VIEW_DISCIPLINE,
  PRIVILEGES.VIEW_MATRICULATION,
  PRIVILEGES.VIEW_USER,
  PRIVILEGES.VIEW_RANK,
  PRIVILEGES.CREATE_RANK,
];
