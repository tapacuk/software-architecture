import type { Activity } from '../activity';

export class Room {
  constructor(
    public id: string,
    public name: string,
    public capacity: number,
    public activities: Activity[],
  ) {}
}
