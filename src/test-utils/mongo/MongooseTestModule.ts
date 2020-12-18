import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongods = new Map<string, MongoMemoryServer>();

export const rootMongooseTestModule = (
  key: string,
  options: MongooseModuleOptions = {},
) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      const mongod = new MongoMemoryServer();
      const mongoUri = await mongod.getUri();
      mongods.set(key, mongod);
      return {
        uri: mongoUri,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        ...options,
      };
    },
  });

export const closeInMongodConnection = async (key: string) => {
  if (mongods.get(key)) await mongods.get(key).stop();
};
