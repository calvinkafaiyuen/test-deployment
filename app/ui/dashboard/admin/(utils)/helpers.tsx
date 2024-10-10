export const verifyPassword = (password: any) => {
  return password === process.env.NEXT_PUBLIC_PASSWORD_FOR_ADMIN_DASHBOARD;
}