import { Status } from '@/consts/Status';

interface Ticket {
  id: string | null;
  title: string;
  name: string;
  email: string;
  status: Status;
  createdAt?: number;
  updatedAt?: number;
  description: string;
  response?: string;
}
