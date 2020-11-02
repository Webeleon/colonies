import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config();
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/colonie';

export const getDb = async () => {
  console.log('Connecting to ', MONGO_URL);
  const client: any= await  MongoClient.connect(MONGO_URL);
  return client.db();
}
