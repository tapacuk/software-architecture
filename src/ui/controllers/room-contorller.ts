import type { RoomService, BookingService } from '../../bll';

export class RoomController {
  private showAll: boolean = false;

  constructor(
    private roomService: RoomService,
    private bookingService: BookingService,
  ) {}

  public initBindings(): void {
    const toggleBtn = document.getElementById('btn-toggle-rooms');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.showAll = !this.showAll;
        toggleBtn.textContent = this.showAll
          ? 'Показувати лише вільні зараз'
          : 'Показати всі';
        this.renderRooms();
      });
    }
  }

  public renderRooms(): void {
    const listElement = document.getElementById('rooms-list');
    if (!listElement) return;

    const rooms = this.roomService.getAllRooms();
    const bookings = this.bookingService.getAllBookings();
    const now = new Date();

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
      const activitiesNames = room.activities.map((a) => a.name).join(', ');

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
  }
}
