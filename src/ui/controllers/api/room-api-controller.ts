import type { Request, Response } from 'express';
import type { RoomService } from '../../../bll';

export class RoomApiController {
  constructor(private roomService: RoomService) {}

  public getAllRooms = (req: Request, res: Response): void => {
    try {
      const rooms = this.roomService.getAllRooms();

      res.status(200).json(rooms);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
