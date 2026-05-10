import {
  RoomRepository,
  BookingRepository,
  ActivityRepository,
  EventPackageRepository,
} from '../repositories';

export class UnitOfWork {
  public rooms: RoomRepository;
  public bookings: BookingRepository;
  public activities: ActivityRepository;
  public eventPackages: EventPackageRepository;

  constructor() {
    this.rooms = new RoomRepository();
    this.bookings = new BookingRepository();
    this.activities = new ActivityRepository();
    this.eventPackages = new EventPackageRepository();
  }
}
