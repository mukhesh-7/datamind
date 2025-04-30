export const login = async (email: string, password: string) => {
  // Call backend to login user from Supabase
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/supabase/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

export const register = async (email: string, password: string, name: string) => {
  // Call backend to register user in Supabase
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/supabase/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  return response.json();
};

export const logout = () => {
  localStorage.removeItem('auth');
};

export const isAuthenticated = () => {
  return localStorage.getItem('auth') !== null;
};

export const resetPassword = async (email: string) => {
  console.log(`Simulating sending password reset email to: ${email}`);
  return { success: true, message: `Password reset email sent to ${email}.` };
};
