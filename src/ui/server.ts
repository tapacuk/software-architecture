import express from 'express';
import cors from 'cors';
import { RoomService, BookingService, EventPackageService } from '../bll';
import { UnitOfWork, Activity, Room, EventPackage } from '../dal';
import { BookingApiController } from './controllers/api/booking-api-controller';
import { RoomApiController } from './controllers/api/room-api-controller';

const app = express();
app.use(cors());
app.use(express.json());

// === 1. Dependency Injection ===
const uow = new UnitOfWork();

// === ІНІЦІАЛІЗАЦІЯ БАЗИ ДАНИХ ===
if (uow.rooms.getAll().length === 0) {
  const act1 = new Activity('a1', 'Кіно на проекторі', 'Film');
  const act2 = new Activity('a2', 'PS5 та Xbox', 'Videogame');
  const act3 = new Activity('a3', 'Мафія та Монополія', 'Boardgame');
  const act4 = new Activity('a4', 'Настільний футбол', 'Sport');

  uow.activities.add(act1);
  uow.activities.add(act2);
  uow.activities.add(act3);
  uow.activities.add(act4);

  uow.rooms.add(new Room('r1', 'Кінозал', 15, [act1]));
  uow.rooms.add(new Room('r2', 'Ігрова кімната з приставками', 5, [act2]));
  uow.rooms.add(new Room('r3', 'Ігрова кімната настільних ігор', 5, [act3]));
  uow.rooms.add(
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

  uow.eventPackages.add(event1);
  uow.eventPackages.add(event2);
  uow.eventPackages.add(event3);
  uow.eventPackages.add(event4);

  uow.commit();
}

const roomService = new RoomService(uow);
const bookingService = new BookingService(uow);
const eventPackageService = new EventPackageService(uow);
const roomController = new RoomApiController(roomService);
const bookingController = new BookingApiController(bookingService);

// === 2. Налаштування маршрутів (Routes) ===
app.get('/api/rooms', roomController.getAllRooms);
app.get('/api/bookings', bookingController.getAllBookings);
app.get('/api/packages', (req, res) => {
  res.json(eventPackageService.getAllPackages());
});
app.post('/api/bookings', bookingController.createBooking);
app.delete('/api/bookings/:id', bookingController.deleteBooking);

// === 3. Запуск сервера ===
app.listen(8080, () => {
  console.log('🚀 Web API запущено на http://localhost:8080');
});
