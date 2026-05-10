import { UnitOfWork, Booking } from '../../dal';
import type { BookingDTO, RoomDTO } from '../dto';
import { Mapper } from '../mappers';

export class BookingService {
  constructor(private uow: UnitOfWork) {}

  getAvailableHalls(startTime: Date, endTime: Date): RoomDTO[] {
    const allHalls = this.uow.rooms.getAll();
    const allBookings = this.uow.bookings.getAll();

    const availableHalls = allHalls.filter((room) => {
      // Отримуємо всі бронювання для поточної зали
      const hallBookings = allBookings.filter((b) => b.hallId === room.id);

      // Логіка перетину часу: перевіряємо, чи є бронювання, яке конфліктує з бажаним часом
      const hasOverlap = hallBookings.some(
        (b) => startTime < b.endTime && endTime > b.startTime,
      );

      // Зала вільна, якщо перетинів немає
      return !hasOverlap;
    });

    return availableHalls.map((hall) => Mapper.toRoomDTO(hall));
  }

  bookRoom(bookingDto: BookingDTO): boolean {
    // 1. Перевірка часу
    if (bookingDto.startTime >= bookingDto.endTime) {
      throw new Error('Час завершення повинен бути пізніше часу початку.');
    }

    // 2. НОВА ПЕРЕВІРКА: Чи існує така зала взагалі?
    const hallExists = this.uow.rooms.getById(bookingDto.hallId);
    if (!hallExists) {
      throw new Error(
        `Помилка: Зали з ID "${bookingDto.hallId}" не існує в базі.`,
      );
    }

    // 3. Перевірка доступності
    const availableHalls = this.getAvailableHalls(
      bookingDto.startTime,
      bookingDto.endTime,
    );
    const isAvailable = availableHalls.some((h) => h.id === bookingDto.hallId);

    if (!isAvailable) {
      throw new Error('Помилка: Ця зала вже зайнята на обраний час.');
      // Тепер ми кидаємо помилку, яку підхопить catch в контролері
    }

    const newBooking = new Booking(
      bookingDto.id,
      bookingDto.hallId,
      bookingDto.startTime,
      bookingDto.endTime,
      bookingDto.isTurnkey,
      bookingDto.eventPackageId,
    );

    this.uow.bookings.add(newBooking);

    return true;
  }

  bookTurnkeyEvent(bookingDto: BookingDTO, eventPackageId: string): boolean {
    // Перевіряємо, чи існує такий пакет послуг
    const eventPackage = this.uow.eventPackages.getById(eventPackageId);
    if (!eventPackage) {
      throw new Error('Вказаного пакету послуг не існує.');
    }

    // Модифікуємо DTO для формату "під ключ"
    bookingDto.isTurnkey = true;
    bookingDto.eventPackageId = eventPackageId;

    // Викликаємо базовий метод бронювання
    return this.bookRoom(bookingDto);
  }
}
