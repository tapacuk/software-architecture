import { UnitOfWork, Booking } from '../../dal';
import type { BookingDTO, RoomDTO } from '../dto';
import { Mapper } from '../mappers';

export class BookingService {
  constructor(private uow: UnitOfWork) {}

  getAvailableRooms(startTime: Date, endTime: Date): RoomDTO[] {
    const allRooms = this.uow.rooms.getAll();
    const allBookings = this.uow.bookings.getAll();

    const availableRooms = allRooms.filter((room) => {
      const roomBookings = allBookings.filter((b) => b.roomID === room.id);

      const hasOverlap = roomBookings.some(
        (b) => startTime < b.endTime && endTime > b.startTime,
      );

      return !hasOverlap;
    });

    return availableRooms.map((room) => Mapper.toRoomDTO(room));
  }

  bookRoom(bookingDTO: BookingDTO): boolean {
    if (bookingDTO.startTime >= bookingDTO.endTime) {
      throw new Error('Час завершення повинен бути пізніше часу початку.');
    }

    const roomExists = this.uow.rooms.getById(bookingDTO.roomID);
    if (!roomExists) {
      throw new Error(
        `Помилка: Зали з ID "${bookingDTO.roomID}" не існує в базі.`,
      );
    }

    const availableRooms = this.getAvailableRooms(
      bookingDTO.startTime,
      bookingDTO.endTime,
    );
    const isAvailable = availableRooms.some((h) => h.id === bookingDTO.roomID);

    if (!isAvailable) {
      throw new Error('Помилка: Ця зала вже зайнята на обраний час.');
    }

    const newBooking = new Booking(
      bookingDTO.id,
      bookingDTO.roomID,
      bookingDTO.startTime,
      bookingDTO.endTime,
      bookingDTO.isTurnkey,
      bookingDTO.eventPackageId,
    );

    this.uow.bookings.add(newBooking);

    return true;
  }

  bookTurnkeyEvent(bookingDto: BookingDTO, eventPackageId: string): boolean {
    const eventPackage = this.uow.eventPackages.getById(eventPackageId);
    if (!eventPackage) {
      throw new Error('Вказаного пакету послуг не існує.');
    }

    const room = this.uow.rooms.getById(bookingDto.roomID);
    if (!room) {
      throw new Error(`Помилка: Кімнати з ID "${bookingDto.roomID}" не існує.`);
    }

    const hasRequiredActivity = room.activities.some(
      (act) => act.type === eventPackage.requiredActivityType,
    );

    if (
      !hasRequiredActivity &&
      eventPackage.requiredActivityType != undefined
    ) {
      throw new Error(
        `Відмова! Для пакету "${eventPackage.name}" у кімнаті обов'язково має бути: "${eventPackage.requiredActivityType}". Оберіть іншу кімнату.`,
      );
    }

    bookingDto.isTurnkey = true;
    bookingDto.eventPackageId = eventPackageId;

    return this.bookRoom(bookingDto);
  }

  getAllBookings(): BookingDTO[] {
    const bookings = this.uow.bookings.getAll();
    return bookings.map((b) => Mapper.toBookingDTO(b));
  }

  cancelBooking(bookingId: string): boolean {
    const booking = this.uow.bookings.getById(bookingId);
    if (!booking) {
      throw new Error('Помилка: Бронювання не знайдено.');
    }

    this.uow.bookings.delete(bookingId);

    return true;
  }
}
