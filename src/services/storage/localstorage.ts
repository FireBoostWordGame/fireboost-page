export default class LocalStorageService {
  static get(key: string): string {
    const item = localStorage.getItem(key);
    if (item === null) {
      return "";
    }

    return item;
  }

  static post(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static delete(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}
