import { FarmInfo } from './types';

export type FarmInfoChangeKey = Exclude<keyof FarmInfo, 'id' | 'pair'>;
export type FarmInfoChanges = Array<FarmInfoChangeKey>;

/**
 * compares two farm info key values
 * this subset of full deep equal functionality does not work on objects or object arrays
 * @param a comparison item a
 * @param b comparison item b
 */
function compareFarmInfoProperty(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.every((el, i) => b[i] === el);
  }
  return false;
}

/**
 * Differences between a current list and an updated list.
 */
export interface FarmListDiff {
  /**
   * Farms from updated list with ids not present in the current list
   */
  readonly added: FarmInfo[];
  /**
   * Farms from current list with id not present in the updated list
   */
  readonly removed: FarmInfo[];
  /**
   * The farm info that changed
   */
  readonly changed: {
    [id: number]: {
      [pair: string]: FarmInfoChanges;
    };
  };
}

/**
 * Computes the diff of a farm list where the first argument is the current list and the second argument is the updated list.
 * @param current current list
 * @param update updated list
 */
export function diffFarmLists(
  current: FarmInfo[],
  update: FarmInfo[]
): FarmListDiff {
  const indexedBase = current.reduce<{
    [id: number]: { [pair: string]: FarmInfo };
  }>((memo, farmInfo) => {
    if (!memo[farmInfo.id]) memo[farmInfo.id] = {};
    memo[farmInfo.id][farmInfo.pair] = farmInfo;
    return memo;
  }, {});

  const newListUpdates = update.reduce<{
    added: FarmInfo[];
    changed: {
      [id: number]: {
        [pair: string]: FarmInfoChanges;
      };
    };
    index: {
      [id: number]: {
        [pair: string]: true;
      };
    };
  }>(
    (memo, farmInfo) => {
      const baseToken = indexedBase[farmInfo.id]?.[farmInfo.pair];
      if (!baseToken) {
        memo.added.push(farmInfo);
      } else {
        const changes: FarmInfoChanges = Object.keys(farmInfo)
          .filter(
            (s): s is FarmInfoChangeKey => s !== 'address' && s !== 'chainId'
          )
          .filter(s => {
            return !compareFarmInfoProperty(farmInfo[s], baseToken[s]);
          });
        if (changes.length > 0) {
          if (!memo.changed[farmInfo.id]) {
            memo.changed[farmInfo.id] = {};
          }
          memo.changed[farmInfo.id][farmInfo.pair] = changes;
        }
      }

      if (!memo.index[farmInfo.id]) {
        memo.index[farmInfo.id] = {
          [farmInfo.pair]: true,
        };
      } else {
        memo.index[farmInfo.id][farmInfo.pair] = true;
      }

      return memo;
    },
    { added: [], changed: {}, index: {} }
  );

  const removed = current.reduce<FarmInfo[]>((list, curr) => {
    if (
      !newListUpdates.index[curr.id] ||
      !newListUpdates.index[curr.id][curr.pair]
    ) {
      list.push(curr);
    }
    return list;
  }, []);

  return {
    added: newListUpdates.added,
    changed: newListUpdates.changed,
    removed,
  };
}
