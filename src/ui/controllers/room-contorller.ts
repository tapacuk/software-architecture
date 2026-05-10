import type { RoomService } from '../../bll/services';

export class RoomController {
  constructor(private roomService: RoomService) {}

  public renderRooms(): void {
    const roomsListElement = document.getElementById('rooms-list');
    if (!roomsListElement) return;

    const rooms = this.roomService.getAllRooms();
    roomsListElement.innerHTML = '';

    rooms.forEach((room) => {
      const li = document.createElement('li');
      const activitiesNames = room.activities.map((a) => a.name).join(', ');
      li.textContent = `Зала: ${room.name} (Доступно: ${activitiesNames}) | ID: ${room.id}`;
      roomsListElement.appendChild(li);
    });
  }
}
