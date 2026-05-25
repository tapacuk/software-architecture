export class BookingController {
  constructor(private onBookingSuccess: () => void) {}

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

  private async populateEventPackages(): Promise<void> {
    const select = document.getElementById(
      'select-event-package',
    ) as HTMLSelectElement;
    if (!select) return;

    try {
      const res = await fetch('http://localhost:8080/api/packages');
      if (!res.ok) throw new Error('Не вдалося отримати пакети');
      const packages = await res.json();
      select.innerHTML = '';
      packages.forEach((pkg: any) => {
        const option = document.createElement('option');
        option.value = pkg.id;
        option.textContent = `${pkg.name} (${pkg.description})`;
        select.appendChild(option);
      });
    } catch (e: any) {
      select.innerHTML =
        '<option disabled>Помилка завантаження пакетів</option>';
    }
  }

  public async renderBookings(): Promise<void> {
    const list = document.getElementById('bookings-list');
    if (!list) return;
    list.innerHTML = '';
    try {
      const [bookingsRes, packagesRes] = await Promise.all([
        fetch('http://localhost:8080/api/bookings'),
        fetch('http://localhost:8080/api/packages'),
      ]);
      if (!bookingsRes.ok || !packagesRes.ok)
        throw new Error('Помилка завантаження');
      const bookings = await bookingsRes.json();
      const packages = await packagesRes.json();

      if (bookings.length === 0) {
        list.innerHTML =
          '<a style="color: #7f8c8d;">Немає активних бронювань</a>';
        return;
      }

      bookings.forEach((b: any) => {
        const li = document.createElement('li');
        let typeText = '';
        if (b.isTurnkey && b.eventPackageId) {
          const pkg = packages.find((p: any) => p.id === b.eventPackageId);
          typeText = pkg ? ` (Під ключ: ${pkg.name})` : ' (Під ключ)';
        }

        const start = new Date(b.startTime).toLocaleString('uk-UA', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
        const end = new Date(b.endTime).toLocaleString('uk-UA', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });

        const textSpan = document.createElement('span');
        textSpan.innerHTML = `<div>Кімната (${b.roomID}) ${typeText}</div> 
                              <div>Забронювано з ${start} по ${end}</div>`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';

        deleteBtn.addEventListener('click', async () => {
          const confirmDelete = confirm(
            'Ви впевнені, що хочете скасувати це бронювання?',
          );
          if (confirmDelete) {
            try {
              const res = await fetch(
                `http://localhost:8080/api/bookings/${b.id}`,
                {
                  method: 'DELETE',
                },
              );
              if (!res.ok) throw new Error('Не вдалося скасувати бронювання');
              await this.renderBookings();
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
    } catch (e: any) {
      list.innerHTML =
        '<a style="color: #e74c3c;">Помилка завантаження бронювань</a>';
    }
  }

  private async handleBooking(): Promise<void> {
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
      alert('Заповніть всі поля!');
      return;
    }

    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      alert('Неправильний формат дати або часу!');
      return;
    }

    const dto = {
      id: Date.now().toString(),
      roomId: roomID,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      isTurnkeyEvent: isTurnkey,
      eventPackageId: isTurnkey ? selectedPackageId : undefined,
    };

    try {
      const res = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));

        throw new Error(
          err.error || err.message || 'Не вдалося забронювати кімнату',
        );
      }
      alert(`Успішно забронювано кімнату ${roomID}!`);
      await this.renderBookings();
      this.onBookingSuccess();
    } catch (error: any) {
      alert('Відмова: ' + (error.message || 'Невідома помилка'));
    }
  }
}
