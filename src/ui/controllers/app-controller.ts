import { RoomService, BookingService, EventPackageService } from '../../bll';
import { UnitOfWork, Activity, Room, EventPackage } from '../../dal';
import { BookingController } from './booking-controller';
import { RoomController } from './room-contorller';

export class AppController {
  private uow: UnitOfWork;
  private roomService: RoomService;
  private bookingService: BookingService;
  private eventPackageService: EventPackageService;

  constructor() {
    this.uow = new UnitOfWork();
    this.seedData();

    this.roomService = new RoomService(this.uow);
    this.bookingService = new BookingService(this.uow);
    this.eventPackageService = new EventPackageService(this.uow);
  }

  public start(): void {
    const roomController = new RoomController(
      this.roomService,
      this.bookingService,
    );

    const bookingController = new BookingController(
      this.bookingService,
      this.eventPackageService,
      () => {
        roomController.renderRooms();
      },
    );

    roomController.initBindings();
    bookingController.initBindings();

    roomController.renderRooms();
    bookingController.renderBookings();
  }

  private seedData(): void {
    if (this.uow.rooms.getAll().length > 0) return;

    const act1 = new Activity('a1', 'Кіно на проекторі', 'Film');
    const act2 = new Activity('a2', 'PS5 та Xbox', 'Videogame');
    const act3 = new Activity('a3', 'Мафія та Монополія', 'Boardgame');
    const act4 = new Activity('a4', 'Настільний футбол', 'Sport');

    this.uow.activities.add(act1);
    this.uow.activities.add(act2);
    this.uow.activities.add(act3);
    this.uow.activities.add(act4);

    this.uow.rooms.add(new Room('r1', 'Кінозал', 15, [act1]));
    this.uow.rooms.add(
      new Room('r2', 'Ігрова кімната з приставками', 5, [act2]),
    );
    this.uow.rooms.add(
      new Room('r3', 'Ігрова кімната настільних ігор', 5, [act3]),
    );
    this.uow.rooms.add(
      new Room('r4', 'Ігрова кімната настільного футболу та ігор', 20, [
        act3,
        act4,
      ]),
    );

    const event1 = new EventPackage(
      'ep1',
      'День Народження для Дітей',
      'Аніматор, торт, ігри',
    );
    const event2 = new EventPackage(
      'ep2',
      'Ніч Кіно',
      'Безлімітний попкорн, 3 фільми',
      'Film',
    );
    const event3 = new EventPackage(
      'ep3',
      'Snack-n-Chill',
      'Ігрова кімната настільних ігор, додаткові снеки та напої',
      'Boardgame',
    );
    const event4 = new EventPackage(
      'ep4',
      'Snack-n-Chill з Приставками',
      'Ігрова кімната відеоігор, додаткові снеки та напої',
      'Videogame',
    );

    this.uow.eventPackages.add(event1);
    this.uow.eventPackages.add(event2);
    this.uow.eventPackages.add(event3);
    this.uow.eventPackages.add(event4);

    this.uow.commit();
  }
}
