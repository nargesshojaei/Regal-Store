export type AdminUser = {
  id: string;
  email: string;
  name: string;
};

export type AdminSession = {
  user: AdminUser;
  token: string;
};
 