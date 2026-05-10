import type { EventPackageDTO, RoomDTO } from '../dto';
import { UnitOfWork } from '../../dal';
import { Mapper } from '../mappers';

export class EventPackageService {
  constructor(private uow: UnitOfWork) {}

  getAllPackages(): EventPackageDTO[] {
    const pack = this.uow.eventPackages.getAll();

    return pack.map((p) => Mapper.toEventPackageDTO(p));
  }

  getPackageById(id: string): EventPackageDTO | undefined {
    const pack = this.uow.eventPackages.getById(id);
    if (!pack) return undefined;

    return Mapper.toEventPackageDTO(pack);
  }
}
