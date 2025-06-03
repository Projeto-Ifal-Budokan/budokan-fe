export const PRIVILEGES = {
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
} as const;

// Type for the privilege values
export type PrivilegeType = (typeof PRIVILEGES)[keyof typeof PRIVILEGES];
