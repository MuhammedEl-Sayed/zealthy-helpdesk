import { Status } from '@/consts/Status';

interface Ticket {
  id: string | null;
  title: string;
  from: string;
  status: Status;
  createdAt?: number;
  updatedAt?: number;
  description: string;
  response?: string;
}
