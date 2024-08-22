const PREFIX = "ginkoia_mtt_";

export class StorageWrapper {
  constructor(private _storage: Storage) {}

  exist(key: string) {
    return !!(
      this._storage.getItem(PREFIX + key) &&
      this._storage.getItem(PREFIX + key) !== "undefined"
    );
  }

  getJson(key: string): object | false {
    if (this.exist(key)) {
      try {
        return JSON.parse(this.get(key) || "{}") as object;
      } catch {
        return false;
      }
    }
    return false;
  }

  setJson(key: string, data: object) {
    this.set(key, JSON.stringify(data));
  }

  get(key: string) {
    if (this.exist(key)) {
      return this._storage.getItem(PREFIX + key);
    }
    return null;
  }

  set(key: string, data: string) {
    this._storage.setItem(PREFIX + key, data);
  }

  remove(key: string) {
    this._storage.removeItem(PREFIX + key);
  }

  clear() {
    this._storage.clear();
  }
}
