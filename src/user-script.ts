import { arrayFields, MetaArrays, Metadata, MetaRecords, MetaSingles, recordFields, singleFields } from "./schema";

function recordsToMap<T extends string | number | symbol, K>(records: Record<T, K>): Map<T, K> {
  const map = new Map<T, K>();

  for (const key in records) {
    map.set(key, records[key]);
  }

  return map;
}

function arrayToSet<T>(array: T[]): Set<T> {
  const set = new Set<T>(array);
  return set;
}

type MetaSinglesKey = keyof MetaSingles;
type MetaSinglesValue = MetaSingles[MetaSinglesKey];

type MetaArraysKey = keyof MetaArrays;
// type MetaArraysValue = MetaArrays[MetaArraysKey];

type MetaRecordsKey = keyof MetaRecords;
// type MetaRecordsValue = MetaRecords[MetaRecordsKey];

export class UserScript {
  private singles: Map<MetaSinglesKey, MetaSinglesValue>;
  private arrays: Map<MetaArraysKey, Set<string>>; // todo, infer type from MetaArrays[MetaArraysKey][number]
  private records: Map<MetaRecordsKey, Map<string, string>>;

  constructor(name: string) {
    this.singles = new Map();
    this.arrays = new Map();
    this.records = new Map();

    this.singles.set("name", name);
  }

  public static async from(metadata: Metadata) {
    const [singles, arrays, records] = await Promise.all([
      singleFields.parseAsync(metadata),
      arrayFields.parseAsync(metadata),
      recordFields.parseAsync(metadata)
    ]);

    const script = new UserScript(singles.name);

    for (const key in arrays) {
      const tKey = key as MetaArraysKey;
      const value = arrays[tKey];

      if (!Array.isArray(value)) {
        continue;
      }

      const set = arrayToSet(value);
      script.arrays.set(tKey, set);
    }

    for (const key in records) {
      const tKey = key as MetaRecordsKey;
      const value = records[tKey];

      if (!value) {
        continue;
      }

      const map = recordsToMap(value);
      script.records.set(tKey, map);
    }

    for (const key in singles) {
      const tKey = key as MetaSinglesKey;
      const value = singles[tKey];

      if (!value) {
        continue;
      }

      script.singles.set(tKey, value);
    }

    return script;
  }
}
