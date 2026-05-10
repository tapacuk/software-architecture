import type { Activity, EventPackage, Room, Booking } from '../../dal';
import type { ActivityDTO, EventPackageDTO, BookingDTO, RoomDTO } from '../dto';

export class Mapper {
  public static toActivityDTO(entity: Activity): ActivityDTO {
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
    };
  }

  public static toEventPackageDTO(entity: EventPackage): EventPackageDTO {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }

  public static toRoomDTO(entity: Room): RoomDTO {
    return {
      id: entity.id,
      name: entity.name,
      activities: entity.activities.map((activity) =>
        this.toActivityDTO(activity),
      ),
    };
  }

  public static toBookingDTO(entity: Booking): BookingDTO {
    return {
      id: entity.id,
      hallId: entity.hallId,
      startTime: entity.startTime,
      endTime: entity.endTime,
      isTurnkey: entity.isTurnkey,
      eventPackageId: entity.eventPackageId,
    };
  }
}
