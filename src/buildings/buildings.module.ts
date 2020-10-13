import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BuildingsService } from './buildings.service';
import { BuildingSchema } from './buildings.model';
import { ResourcesModule } from '../resources/resources.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Buildings', schema: BuildingSchema }]),
    ResourcesModule,
  ],
  providers: [BuildingsService],
  exports: [BuildingsService],
})
export class BuildingsModule {}
