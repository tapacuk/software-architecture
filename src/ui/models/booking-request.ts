export interface CreateBookingRequest {
  roomId: string;
  startTime: string;
  endTime: string;
  isTurnkeyEvent: boolean;
  eventPackageId?: string;
}
