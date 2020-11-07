import { getDb } from '../migration-helpers/db';
import { INITIAL_GOLD_SUPPLY } from '../game/resources.constants';

export const up = async () => {
  const db = await getDb();
  db.collection('resources').updateMany(
    {},
    {
      $set: {
        gold: INITIAL_GOLD_SUPPLY,
      },
    },
  );
};

export const down = async () => {
  const db = await getDb();
  db.collection('resources').updateMany(
    {},
    {
      $unset: {
        gold: -1,
      },
    },
  );
};
