import { BookingService, RoomService } from '../../bll/services';
import { UnitOfWork, Activity, EventPackage, Room } from '../../dal';
import { BookingController } from './booking-controller';
import { RoomController } from './room-contorller';

export class AppController {
  private uow: UnitOfWork;
  private roomService: RoomService;
  private bookingService: BookingService;

  constructor() {
    // 1. Створюємо єдиний контекст даних
    this.uow = new UnitOfWork();

    // 2. Наповнюємо початковими даними для демонстрації
    this.seedData();

    // 3. Ініціалізуємо сервіси бізнес-логіки
    this.roomService = new RoomService(this.uow);
    this.bookingService = new BookingService(this.uow);
  }

  public start(): void {
    // 4. Запускаємо контролери, передаючи їм сервіси (UI знає тільки про BLL)
    const roomController = new RoomController(this.roomService);
    const bookingController = new BookingController(this.bookingService);

    roomController.renderRooms();
    bookingController.initBindings();
  }

  private seedData(): void {
    const act1 = new Activity('a1', 'Кіно на проекторі', 'Film');
    const act2 = new Activity('a2', 'PS5 та Xbox', 'Videogame');
    const act3 = new Activity('a3', 'Мафія та Монополія', 'Boardgame');

    this.uow.activities.add(act1);
    this.uow.activities.add(act2);
    this.uow.activities.add(act3);

    this.uow.rooms.add(new Room('h1', 'Кінозал', 25, [act1]));
    this.uow.rooms.add(new Room('h2', 'Ігрова кімната', 6, [act2, act3]));

    this.uow.eventPackages.add(
      new EventPackage(
        'ep1',
        'Дитячий День Народження',
        'Аніматор, торт, ігри',
      ),
    );
  }
}
