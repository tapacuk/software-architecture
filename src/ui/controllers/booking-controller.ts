import {
  BookingService,
  EventPackageService,
  type BookingDTO,
} from '../../bll';

export class BookingController {
  constructor(
    private bookingService: BookingService,
    private eventPackageService: EventPackageService,
    private onBookingSuccess: () => void,
  ) {}

  public initBindings(): void {
    const bookBtn = document.getElementById('btn-book');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => this.handleBooking());
    }

    const turnkeyCheckbox = document.getElementById(
      'input-turnkey',
    ) as HTMLInputElement;
    const turnkeyOptions = document.getElementById('turnkey-options');

    if (turnkeyCheckbox && turnkeyOptions) {
      turnkeyCheckbox.addEventListener('change', (e) => {
        turnkeyOptions.style.display = (e.target as HTMLInputElement).checked
          ? 'block'
          : 'none';
      });
    }

    this.populateEventPackages();
  }

  private populateEventPackages(): void {
    const select = document.getElementById(
      'select-event-package',
    ) as HTMLSelectElement;
    if (!select) return;

    const packages = this.eventPackageService.getAllPackages();
    select.innerHTML = '';

    packages.forEach((pkg) => {
      const option = document.createElement('option');
      option.value = pkg.id;
      option.textContent = `${pkg.name} (${pkg.description})`;
      select.appendChild(option);
    });
  }

  public renderBookings(): void {
    const list = document.getElementById('bookings-list');
    if (!list) return;

    const bookings = this.bookingService.getAllBookings();
    const packages = this.eventPackageService.getAllPackages();
    list.innerHTML = '';

    if (bookings.length === 0) {
      list.innerHTML =
        '<a style="color: #7f8c8d;">Немає активних бронювань</a>';
      return;
    }

    bookings.forEach((b) => {
      const li = document.createElement('li');

      let typeText = '';
      if (b.isTurnkey && b.eventPackageId) {
        const pkg = packages.find((p) => p.id === b.eventPackageId);
        typeText = pkg ? ` (Під ключ: ${pkg.name})` : ' (Під ключ)';
      }

      const start = b.startTime.toLocaleString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
      const end = b.endTime.toLocaleString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const textSpan = document.createElement('span');
      textSpan.innerHTML = `<div>Кімната (${b.roomID}) ${typeText}</div> 
                            <div>Забронювано з ${start} по ${end}</div>`;

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '✕';

      deleteBtn.addEventListener('click', () => {
        const confirmDelete = confirm(
          'Ви впевнені, що хочете скасувати це бронювання?',
        );
        if (confirmDelete) {
          try {
            this.bookingService.cancelBooking(b.id);
            this.renderBookings();
            this.onBookingSuccess();
          } catch (error: any) {
            alert(error.message);
          }
        }
      });

      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.style.marginBottom = '10px';

      if (b.isTurnkey) {
        li.style.borderLeft = '4px solid #f1c40f';
      }

      li.appendChild(textSpan);
      li.appendChild(deleteBtn);

      list.appendChild(li);
    });
  }

  private handleBooking(): void {
    const roomInput = document.getElementById(
      'input-room-id',
    ) as HTMLInputElement | null;
    const startInput = document.getElementById(
      'input-start',
    ) as HTMLInputElement | null;
    const endInput = document.getElementById(
      'input-end',
    ) as HTMLInputElement | null;
    const turnkeyCheckbox = document.getElementById(
      'input-turnkey',
    ) as HTMLInputElement | null;
    const packageSelect = document.getElementById(
      'select-event-package',
    ) as HTMLSelectElement | null;

    if (
      !roomInput ||
      !startInput ||
      !endInput ||
      !turnkeyCheckbox ||
      !packageSelect
    )
      return;

    const roomID = roomInput.value.trim();
    const startTimeStr = startInput.value;
    const endTimeStr = endInput.value;
    const isTurnkey = turnkeyCheckbox.checked;
    const selectedPackageId = packageSelect.value;

    if (!roomID || !startTimeStr || !endTimeStr) {
      alert('Помилка: Заповніть всі поля!');
      return;
    }

    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      alert('Помилка: Неправильний формат дати або часу!');
      return;
    }

    const dto: BookingDTO = {
      id: Date.now().toString(),
      roomID: roomID,
      startTime: startTime,
      endTime: endTime,
      isTurnkey: isTurnkey,
      eventPackageId: isTurnkey ? selectedPackageId : undefined,
    };

    try {
      const success = isTurnkey
        ? this.bookingService.bookTurnkeyEvent(dto, dto.eventPackageId!)
        : this.bookingService.bookRoom(dto);

      if (success) {
        alert(`Успішно забронювано кімнату ${roomID}!`);
        this.renderBookings();
        this.onBookingSuccess();
      }
    } catch (error: any) {
      alert('Відмова: ' + error.message);
    }
  }
}
