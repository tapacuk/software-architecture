export class Booking {
  constructor(
    public id: string,
    public hallId: string,
    public startTime: Date,
    public endTime: Date,
    public isTurnkey: boolean,
    public eventPackageId: string | undefined,
  ) {}
}
