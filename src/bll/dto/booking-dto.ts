export type BookingDTO = {
  id: string;
  hallId: string;
  startTime: Date;
  endTime: Date;
  isTurnkey: boolean;
  eventPackageId?: string;
};
