export class RuntimeConfig {
  static string(name: string, fallback = ''): string {
    const value = process.env[name];
    return value === undefined || value === '' ? fallback : value;
  }

  static number(name: string, fallback: number): number {
    const value = Number(process.env[name]);
    return Number.isFinite(value) ? value : fallback;
  }

  static boolean(name: string, fallback = false): boolean {
    const value = process.env[name];
    if (value === undefined || value === '') return fallback;
    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
  }

  static list(name: string, fallback: string[] = []): string[] {
    const value = process.env[name];
    return value ? value.split(',').map((item) => item.trim()).filter(Boolean) : fallback;
  }

  static validateProduction(): void {
    if (process.env.NODE_ENV !== 'production') return;
    const secret = this.string('JWT_SECRET');
    if (!secret || secret === 'abcdefghijklmnopqrstuvwxyz') {
      throw new Error('生产环境必须配置独立的 JWT_SECRET');
    }
    if (!this.string('DB_PASSWORD')) throw new Error('生产环境必须配置 DB_PASSWORD');
  }
}
