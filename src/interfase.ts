import { JwtHeader, JwtPayload } from 'jsonwebtoken';

interface CustomUserData {
  id: number;
  email: string;
  password: string;
  recoveryPasswordId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CustomJwtPayload extends JwtPayload {
  data: CustomUserData;
}

export interface CustomJwtToken {
  header: JwtHeader;
  payload: CustomJwtPayload;
  signature: string;
}