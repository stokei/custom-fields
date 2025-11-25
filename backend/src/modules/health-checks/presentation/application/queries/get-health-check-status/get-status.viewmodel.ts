import { BaseViewModel } from '@/shared/application/base/viewmodel-base';
import { ApiProperty } from '@nestjs/swagger';

interface GetHealthCheckStatusViewModelProps {
  readonly ok: boolean;
}
export class GetHealthCheckStatusViewModel extends BaseViewModel {
  @ApiProperty({ type: 'boolean' })
  readonly ok: boolean;
  private constructor(data: GetHealthCheckStatusViewModelProps) {
    super();

    this.ok = data.ok;
  }

  static create(field: GetHealthCheckStatusViewModelProps) {
    return new GetHealthCheckStatusViewModel(field);
  }

  toJSON() {
    return {
      ok: this.ok,
    };
  }
}
