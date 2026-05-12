export interface BookingDTO {
  id: string;
  roomID: string;
  startTime: Date;
  endTime: Date;
  isTurnkey: boolean;
  eventPackageId?: string;
}
