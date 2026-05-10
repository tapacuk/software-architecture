import type { BookingDTO } from '../../bll/dto';
import type { BookingService } from '../../bll/services';

export class BookingController {
  constructor(private bookingService: BookingService) {}

  public initBindings(): void {
    const bookBtn = document.getElementById('btn-book');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => this.handleBooking());
    }
  }

  private handleBooking(): void {
    // Зчитуємо дані з простого UI
    const hallId = (
      document.getElementById('input-hall-id') as HTMLInputElement
    ).value;
    const startTimeStr = (
      document.getElementById('input-start') as HTMLInputElement
    ).value;
    const endTimeStr = (
      document.getElementById('input-end') as HTMLInputElement
    ).value;
    const isTurnkey = (
      document.getElementById('input-turnkey') as HTMLInputElement
    ).checked;

    if (!hallId || !startTimeStr || !endTimeStr) {
      alert('Заповніть всі поля!');
      return;
    }

    const dto: BookingDTO = {
      id: Date.now().toString(), // Проста генерація ID
      hallId: hallId,
      startTime: new Date(startTimeStr),
      endTime: new Date(endTimeStr),
      isTurnkey: isTurnkey,
      eventPackageId: isTurnkey ? 'ep1' : undefined, // Беремо наш тестовий пакет
    };

    try {
      const success = isTurnkey
        ? this.bookingService.bookTurnkeyEvent(dto, dto.eventPackageId!)
        : this.bookingService.bookRoom(dto);

      if (success) {
        alert('Успішно забронювано! Оновіть сторінку, щоб побачити зміни.');
      }
    } catch (error: any) {
      alert(error.message);
    }
  }
}
