import { getUserPrivileges } from '@/lib/auth';

interface ServerProtectedComponentProps {
  privilege?: string;
  privileges?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export async function ServerProtectedComponent({
  privilege,
  privileges = [],
  requireAll = false,
  fallback = null,
  children,
}: ServerProtectedComponentProps) {
  const user = await getUserPrivileges();

  if (!user) {
    return <>{fallback}</>;
  }

  let hasAccess = false;

  if (privilege) {
    hasAccess = user.privileges.some((p) => p.name === privilege);
  } else if (privileges.length > 0) {
    hasAccess = requireAll
      ? privileges.every((p) => user.privileges.some((priv) => priv.name === p))
      : privileges.some((p) => user.privileges.some((priv) => priv.name === p));
  } else {
    hasAccess = true;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
