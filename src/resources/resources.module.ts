import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ResourcesService } from './resources.service';
import { ResourcesSchema } from './resources.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Resources', schema: ResourcesSchema }]),
  ],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
