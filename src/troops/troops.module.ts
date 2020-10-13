import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TroopsService } from './troops.service';
import { TroopsSchema } from './troops.model';
import { ResourcesModule } from '../resources/resources.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Troops', schema: TroopsSchema }]),
    ResourcesModule,
  ],
  providers: [TroopsService],
  exports: [TroopsService],
})
export class TroopsModule {}
