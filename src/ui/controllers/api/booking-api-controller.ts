import * as express from 'express';
import type { BookingDTO, BookingService } from '../../../bll';
import type { CreateBookingRequest } from '../../models/booking-request';

export class BookingApiController {
  constructor(private bookingService: BookingService) {}

  public getAllBookings = (
    req: express.Request,
    res: express.Response,
  ): void => {
    res.json(this.bookingService.getAllBookings());
  };

  public createBooking = (
    req: express.Request,
    res: express.Response,
  ): void => {
    try {
      const data = req.body as CreateBookingRequest;

      const dto: BookingDTO = {
        id: Date.now().toString(),
        roomID: data.roomId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        isTurnkey: data.isTurnkeyEvent,
        eventPackageId: data.eventPackageId,
      };

      const success =
        data.isTurnkeyEvent && data.eventPackageId
          ? this.bookingService.bookTurnkeyEvent(dto, data.eventPackageId)
          : this.bookingService.bookRoom(dto);

      res.status(201).json({ message: 'Успішно забронювано!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public deleteBooking = (
    req: express.Request,
    res: express.Response,
  ): void => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        throw new Error('Invalid booking id');
      }

      this.bookingService.cancelBooking(id);
      res.json({ message: 'Бронювання скасовано' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}
