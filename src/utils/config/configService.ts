export default class ConfigService {
  get<T = any>(key: string, defaultValue: T): T {
    const variable = process.env[key] as T | undefined;
    if (variable === null || variable === undefined) return defaultValue;
    return variable;
  }
}
