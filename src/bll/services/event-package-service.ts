import type { UnitOfWork } from '../../dal';
import type { EventPackageDTO } from '../dto';
import { Mapper } from '../mappers';

export class EventPackageService {
  constructor(private uow: UnitOfWork) {}

  getAllPackages(): EventPackageDTO[] {
    const packages = this.uow.eventPackages.getAll();
    return packages.map((p) => Mapper.toEventPackageDTO(p));
  }
}
