import type { Booking } from '../entities';
import { GenericRepository } from './generic-repository';

export class BookingRepository extends GenericRepository<Booking> {
  constructor() {
    super('db_bookings');
  }

  protected override loadFromStorage(): void {
    super.loadFromStorage();

    this.items = this.items.map((b: any) => ({
      ...b,
      startTime: new Date(b.startTime),
      endTime: new Date(b.endTime),
    }));
  }

  getBookingsByRoomId(roomID: string): Booking[] {
    return this.items.filter((booking) => booking.roomID === roomID);
  }
}
