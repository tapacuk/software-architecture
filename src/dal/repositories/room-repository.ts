import type { ActivityType, Booking, Room } from '../entities';
import { GenericRepository } from './generic-repository';

export class RoomRepository extends GenericRepository<Room> {
  getRoomsByActivity(activity: ActivityType): Room[] {
    return this.items.filter((room) =>
      room.activities.map((a) => a.type === activity),
    );
  }
}
