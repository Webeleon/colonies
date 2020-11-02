import { getDb } from '../migration-helpers/db';

export const up = async () => {
  const db = await getDb();
  const buildingsCursor = await db.collection('buildings')
    .find({});
  for await (const buildingDocument of buildingsCursor) {
    await db.collection('buildings').updateOne(
      {
        _id: buildingDocument._id,
      },
      {
        $set: {
          houses: buildingDocument.homes,
        },
        $unset: {
          homes: -1,
        },
      }
    )
  }
}

export const down = async () => {
  const db = await getDb();
  const buildingsCursor = await db.collection('buildings')
    .find({});
  for await (const buildingDocument of buildingsCursor) {
    await db.collection('buildings').updateOne(
      {
        _id: buildingDocument._id,
      },
      {
        $set: {
          homes: buildingDocument.houses,
        },
        $unset: {
          houses: -1,
        },
      }
    )
  }
}
