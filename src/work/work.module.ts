import { Module } from '@nestjs/common';
import { WorkService } from './work.service';
import { TroopsModule } from '../troops/troops.module';
import { ResourcesModule } from '../resources/resources.module';

@Module({
  imports: [TroopsModule, ResourcesModule],
  providers: [WorkService],
  exports: [WorkService],
})
export class WorkModule {}
