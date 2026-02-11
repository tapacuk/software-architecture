import type { UsageIntensity } from './types/usage-intensity.type';

export class Task {
  constructor(
    public name: string,
    public intensity: UsageIntensity,
  ) {}
}
