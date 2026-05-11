export class Booking {
  constructor(
    public id: string,
    public roomID: string,
    public startTime: Date,
    public endTime: Date,
    public isTurnkey: boolean,
    public eventPackageId: string | undefined,
  ) {}
}
