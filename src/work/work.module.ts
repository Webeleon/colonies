import { Module } from '@nestjs/common';
import { WorkService } from './work.service';
import { TroopsModule } from '../troops/troops.module';
import { ResourcesModule } from '../resources/resources.module';
import { GameModule } from '../game/game.module';

@Module({
  imports: [TroopsModule, ResourcesModule, GameModule],
  providers: [WorkService],
  exports: [WorkService],
})
export class WorkModule {}
