import type { ActivityType } from '../activity';

export class EventPackage {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public requiredActivityType?: ActivityType,
  ) {}
}
