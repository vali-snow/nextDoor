import { Activity } from './activity.model';

export class User {
  Id?: string;
  FirstName?: string;
  LastName?: string;
  Email: string;
  Password: string;
  PhoneNumber?: string;
  Activity: Activity[] = [];
  DateCreated?: Date;
}
