import type { ActivityType } from './activity-type';

export class Activity {
  constructor(
    public id: string,
    public name: string,
    public type: ActivityType,
  ) {}
}
