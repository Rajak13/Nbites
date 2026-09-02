export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'MERCHANT' | 'DRIVER' | 'ADMIN';
}

export function getCurrentSession(): SessionUser | null {
  // Demo session helper for nBites client/server state
  return {
    id: 'usr-demo-891',
    name: 'Aayush Shrestha',
    email: 'aayush@nbites.com',
    phone: '9841234567',
    role: 'CUSTOMER',
  };
}
