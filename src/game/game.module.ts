import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [MemberModule],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
