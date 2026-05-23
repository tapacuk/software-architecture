import { BookingController } from './controllers/booking-controller';
import { RoomController } from './controllers/room-contorller';

document.addEventListener('DOMContentLoaded', () => {
  const roomController = new RoomController();

  const bookingController = new BookingController(() => {
    roomController.renderRooms();
  });

  roomController.initBindings();
  bookingController.initBindings();

  roomController.renderRooms();
  bookingController.renderBookings();
});
