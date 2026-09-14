export type Identifiable = { id: string };

export function readStored<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function readCollection<T extends Identifiable>(key: string): T[] {
  return readStored<T[]>(key, []);
}

export function writeStored<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function writeCollection<T extends Identifiable>(key: string, records: T[]): void {
  writeStored(key, records);
}

export function createRecord<T extends Identifiable>(records: T[], record: T): T[] {
  return [record, ...records];
}

export function updateRecord<T extends Identifiable>(records: T[], id: string, changes: Partial<T>): T[] {
  return records.map((record) => (record.id === id ? { ...record, ...changes } : record));
}

export function deleteRecord<T extends Identifiable>(records: T[], id: string): T[] {
  return records.filter((record) => record.id !== id);
}

export function hasRecord<T extends Identifiable>(records: T[], id: string): boolean {
  return records.some((record) => record.id === id);
}
