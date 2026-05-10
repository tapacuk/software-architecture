import type { RoomDTO } from '../dto';
import { UnitOfWork } from '../../dal';
import { Mapper } from '../mappers';

export class RoomService {
  constructor(private uow: UnitOfWork) {}

  getAllRooms(): RoomDTO[] {
    const rooms = this.uow.rooms.getAll();

    return rooms.map((r) => Mapper.toRoomDTO(r));
  }

  getRoomById(id: string): RoomDTO | undefined {
    const room = this.uow.rooms.getById(id);
    if (!room) return undefined;

    return Mapper.toRoomDTO(room);
  }
}
