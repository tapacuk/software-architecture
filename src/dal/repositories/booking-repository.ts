import type { Booking } from '../entities';
import { GenericRepository } from './generic-repository';

export class BookingRepository extends GenericRepository<Booking> {
  getBookingsByRoomId(roomID: string): Booking[] {
    return this.items.filter((booking) => booking.roomID === roomID);
  }
}
