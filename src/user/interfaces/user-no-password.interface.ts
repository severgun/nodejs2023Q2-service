export interface UserNoPassword {
  id: string; // uuid v4
  login: string;
  createdAt: Date;
  updatedAt: Date;
  version: number; // integer number, increments on update
}
