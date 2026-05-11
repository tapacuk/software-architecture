import { RoomService, BookingService, EventPackageService } from '../../bll';
import { UnitOfWork, Activity, Room, EventPackage } from '../../dal';
import { BookingController } from './booking-controller';
import { RoomController } from './room-contorller';

export class AppController {
  private uow: UnitOfWork;
  private roomService: RoomService;
  private bookingService: BookingService;
  private eventPackageService: EventPackageService; // ДОДАЛИ ПОЛЕ

  constructor() {
    this.uow = new UnitOfWork();
    this.seedData();

    this.roomService = new RoomService(this.uow);
    this.bookingService = new BookingService(this.uow);
    this.eventPackageService = new EventPackageService(this.uow); // ІНІЦІАЛІЗУВАЛИ
  }

  public start(): void {
    const roomController = new RoomController(
      this.roomService,
      this.bookingService,
    );

    // ПЕРЕДАЄМО eventPackageService ДРУГИМ ПАРАМЕТРОМ
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

    this.uow.activities.add(act1);
    this.uow.activities.add(act2);
    this.uow.activities.add(act3);

    this.uow.rooms.add(new Room('r1', 'Кінозал', 15, [act1]));
    this.uow.rooms.add(new Room('r2', 'Ігрова кімната', 5, [act2, act3]));

    // Додали ДВА пакети, щоб було цікавіше
    this.uow.eventPackages.add(
      new EventPackage(
        'ep1',
        'Дитячий День Народження',
        'Аніматор, торт, ігри',
      ),
    );

    this.uow.eventPackages.add(
      new EventPackage(
        'ep2',
        'Ніч Кіно',
        'Безлімітний попкорн, 3 фільми',
        'Film',
      ),
    );

    this.uow.commit();
  }
}
