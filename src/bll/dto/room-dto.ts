import type { ActivityDTO } from './activity-dto';

export type RoomDTO = {
  id: string;
  name: string;
  activities: ActivityDTO[];
};
