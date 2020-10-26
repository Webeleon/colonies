import { Module } from '@nestjs/common';

import { MemberModule } from '../member/member.module';
import { TroopsModule } from '../troops/troops.module';
import { BuildingsModule } from '../buildings/buildings.module';

import { GameService } from './game.service';

@Module({
  imports: [
    MemberModule, TroopsModule, BuildingsModule
  ],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
