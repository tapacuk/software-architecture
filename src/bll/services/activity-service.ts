import type { ActivityDTO, EventPackageDTO, RoomDTO } from '../dto';
import { UnitOfWork } from '../../dal';
import { Mapper } from '../mappers';

export class ActivityService {
  constructor(private uow: UnitOfWork) {}

  getAllActivities(): ActivityDTO[] {
    const activities = this.uow.activities.getAll();

    return activities.map((a) => Mapper.toActivityDTO(a));
  }

  getActivityById(id: string): ActivityDTO | undefined {
    const activity = this.uow.activities.getById(id);
    if (!activity) return undefined;

    return Mapper.toActivityDTO(activity);
  }
}
