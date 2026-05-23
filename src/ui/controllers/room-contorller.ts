export class RoomController {
  private showAll: boolean = false;
  private selectedActivity: string = 'all';

  constructor() {}

  public initBindings(): void {
    const toggleBtn = document.getElementById('btn-toggle-rooms');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.showAll = !this.showAll;
        toggleBtn.textContent = this.showAll
          ? 'Показувати лише вільні зараз'
          : 'Показати заброньовані';
        this.renderRooms();
      });
    }

    const filterSelect = document.getElementById(
      'select-activity-filter',
    ) as HTMLSelectElement;
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.selectedActivity = (e.target as HTMLSelectElement).value;
        this.renderRooms();
      });
    }

    this.populateActivityFilter();
  }

  private async populateActivityFilter(): Promise<void> {
    const filterSelect = document.getElementById(
      'select-activity-filter',
    ) as HTMLSelectElement;
    if (!filterSelect) return;

    try {
      const response = await fetch('http://localhost:8080/api/rooms');
      const rooms: any[] = await response.json();
      const uniqueActivityTypes = new Set<string>();

      rooms.forEach((r) =>
        r.activities.forEach((a: any) => uniqueActivityTypes.add(a.type)),
      );

      uniqueActivityTypes.forEach((actType) => {
        const option = document.createElement('option');
        option.value = actType;
        option.textContent = actType;
        filterSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Помилка завантаження фільтрів:', error);
    }
  }

  // Звертається до API
  public async renderRooms(): Promise<void> {
    const listElement = document.getElementById('rooms-list');
    if (!listElement) return;

    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        fetch('http://localhost:8080/api/rooms'),
        fetch('http://localhost:8080/api/bookings'),
      ]);

      let rooms: any[] = await roomsRes.json();
      const rawBookings: any[] = await bookingsRes.json();

      const bookings = rawBookings.map((b) => ({
        ...b,
        startTime: new Date(b.startTime),
        endTime: new Date(b.endTime),
      }));

      const now = new Date();

      if (this.selectedActivity !== 'all') {
        rooms = rooms.filter((room) =>
          room.activities.some((a: any) => a.type === this.selectedActivity),
        );
      }

      listElement.innerHTML = '';

      const roomsWithStatus = rooms.map((room) => {
        const activeBookings = bookings.filter(
          (b) => b.roomID === room.id && b.startTime <= now && b.endTime > now,
        );
        return {
          room: room,
          activeBookings: activeBookings,
          isOccupied: activeBookings.length > 0,
        };
      });

      roomsWithStatus.sort((a, b) => {
        if (a.isOccupied === b.isOccupied) return 0;
        return a.isOccupied ? 1 : -1;
      });

      roomsWithStatus.forEach((item) => {
        const { room, activeBookings, isOccupied } = item;

        if (!this.showAll && isOccupied) {
          return;
        }

        const li = document.createElement('li');
        const activitiesNames = room.activities
          .map((a: any) => a.name)
          .join(', ');

        let statusHtml = '';
        if (isOccupied) {
          const freeAtTimes = activeBookings.map((b) => b.endTime.getTime());
          const maxFreeAt = new Date(Math.max(...freeAtTimes));
          const timeStr = maxFreeAt.toLocaleString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });

          statusHtml = `🔴 | Зайнята до ${timeStr}`;
          li.style.borderLeft = '4px solid var(--attention-color)';
        } else {
          statusHtml = `🟢 | Вільна зараз`;
        }

        li.innerHTML = `
                  <div style="margin-bottom: 0px;"><b>Кімната:</b> ${room.name} (ID: ${room.id})</div>
                  <div style="margin-bottom: 0px;">${activitiesNames}</div>
                  <div style="font-weight: 500;">${statusHtml}</div>
              `;

        listElement.appendChild(li);
      });
    } catch (error) {
      console.error('Помилка завантаження кімнат:', error);
    }
  }
}
