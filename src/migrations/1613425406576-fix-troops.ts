import { getDb } from '../migration-helpers/db';

export const up = async () => {
  const db = await getDb();
  const troopsCursor = await db.collection('troops').find({});

  for await (const t of troopsCursor) {
    await db.collection('troops').updateOne(
      {
        _id: t._id,
      },
      {
        $set: {
          gatherers: t.gatherers === Infinity ? 0 : t.gatherers,
          scavengers: t.scavengers === Infinity ? 0 : t.scavengers,
          guards: t.guards === Infinity ? 0 : t.guards,
          lightInfantry: t.lightInfantry === Infinity ? 0 : t.lightInfantry,
        },
      },
    );
  }
};

export const down = async () => {
  /*
      No coming back on this one!
   */
};
