export function toSet<T>(array: T[]) {
  return new Set<T>(array);
};

export function toMap<T extends string | number | symbol, K>(record: Record<T, K>): Map<T, K> {
  const map = new Map<T, K>();

  for (const key in record) {
    map.set(key, record[key]);
  }

  return map;
}
