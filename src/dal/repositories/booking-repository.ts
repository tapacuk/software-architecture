import type { Booking } from '../entities';
import { GenericRepository } from './generic-repository';

export class BookingRepository extends GenericRepository<Booking> {
  getBookingsByHallId(hallId: string): Booking[] {
    return this.items.filter((booking) => booking.hallId === hallId);
  }
}
