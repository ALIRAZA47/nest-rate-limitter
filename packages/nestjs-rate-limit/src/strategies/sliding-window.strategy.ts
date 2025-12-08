import { RateLimitStrategy, RateLimitStorage } from '../interfaces/rate-limit-strategy.interface';

export class SlidingWindowStrategy implements RateLimitStrategy {
  constructor(
    private readonly limit: number,
    private readonly windowSeconds: number,
  ) {
    if (limit <= 0) {
      throw new Error('Limit must be greater than 0');
    }
    if (windowSeconds <= 0) {
      throw new Error('Window seconds must be greater than 0');
    }
  }

  async check(key: string, storage: RateLimitStorage): Promise<boolean> {
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - this.windowSeconds;
    const storageKey = `sliding:${key}`;

    // Get all timestamps for this key
    const data = await storage.get(storageKey);
    let timestamps: number[] = [];

    if (data) {
      try {
        timestamps = JSON.parse(data);
        // Filter out timestamps outside the current window
        timestamps = timestamps.filter((ts) => ts > windowStart);
      } catch {
        timestamps = [];
      }
    }

    // Check if limit is exceeded
    if (timestamps.length >= this.limit) {
      return false;
    }

    // Add current timestamp
    timestamps.push(now);
    await storage.set(storageKey, JSON.stringify(timestamps), this.windowSeconds);

    return true;
  }

  async getRemaining(key: string, storage: RateLimitStorage): Promise<number> {
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - this.windowSeconds;
    const storageKey = `sliding:${key}`;

    const data = await storage.get(storageKey);
    if (!data) {
      return this.limit;
    }

    try {
      const timestamps: number[] = JSON.parse(data);
      const validTimestamps = timestamps.filter((ts) => ts > windowStart);
      return Math.max(0, this.limit - validTimestamps.length);
    } catch {
      return this.limit;
    }
  }

  async getResetTime(key: string, storage: RateLimitStorage): Promise<number> {
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - this.windowSeconds;
    const storageKey = `sliding:${key}`;

    const data = await storage.get(storageKey);
    if (!data) {
      return now;
    }

    try {
      const timestamps: number[] = JSON.parse(data);
      const validTimestamps = timestamps.filter((ts) => ts > windowStart);
      
      if (validTimestamps.length === 0) {
        return now;
      }

      // Return the time when the oldest request in the window will expire
      const oldestTimestamp = Math.min(...validTimestamps);
      return oldestTimestamp + this.windowSeconds;
    } catch {
      return now;
    }
  }
}

