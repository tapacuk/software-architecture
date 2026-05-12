import type { ActivityDTO } from './activity-dto';

export interface RoomDTO {
  id: string;
  name: string;
  activities: ActivityDTO[];
}
