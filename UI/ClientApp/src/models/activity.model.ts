import { ActivityType } from './enums/activity.type.enum';

export class Activity {
  Id?: string;
  Date: Date;
  Type: ActivityType;
  Message: string;
  Reference?: string;
}
