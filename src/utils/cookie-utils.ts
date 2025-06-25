'use server';

import { cookies } from 'next/headers';

export const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return cookieHeader;
};
