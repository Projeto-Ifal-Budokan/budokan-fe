# Access Control and Privileges

Two layers are used:

1. Page/route access (coarse):

- `src/middleware.ts` blocks unauthenticated users from `/dashboard/*`

2. Capability access (fine):

- `src/lib/auth.ts` fetches user and checks privileges by name; provides `requirePrivilege()` and variations
- `src/utils/access-control.ts` maps `ProfileType` → required privileges and verifies the user against that list

## Privilege helpers (`src/lib/auth.ts`)

- `getUserPrivileges()` → returns `User | null` via `authService.me()`
- `hasPrivilege(name)`, `hasAnyPrivilege(names[])`, `hasAllPrivileges(names[])`
- `requirePrivilege(name)` and `requireAnyPrivilege(names[])`: redirect to access denied if not satisfied

## Profile access (`src/utils/access-control.ts`)

- `PROFILE_PRIVILEGES`: maps `instructor | student | admin` → required privileges
- `hasAccess(profileType, privileges)` → boolean
- `checkUserAccess(profileType)` → fetches user and privileges from API, then returns boolean

Note: Ensure the access denied route matches your actual page. The code includes `dashboard/acesso-negado`.
