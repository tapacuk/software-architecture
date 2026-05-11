import type { Activity } from '../entities';
import { GenericRepository } from './generic-repository';

export class ActivityRepository extends GenericRepository<Activity> {
  constructor() {
    super('db_activities');
  }
  getActivitiesById(id: string): Activity[] {
    return this.items.filter((activity) => activity.id === id);
  }
}
