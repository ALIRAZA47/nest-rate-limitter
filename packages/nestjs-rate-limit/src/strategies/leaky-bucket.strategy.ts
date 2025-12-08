import { RateLimitStrategy, RateLimitStorage } from '../interfaces/rate-limit-strategy.interface';

interface LeakyBucketData {
  level: number; // Current water level in the bucket
  lastLeakTime: number; // Last time the bucket leaked
}

export class LeakyBucketStrategy implements RateLimitStrategy {
  constructor(
    private readonly capacity: number,
    private readonly leakRate: number, // tokens per second
  ) {
    if (capacity <= 0) {
      throw new Error('Capacity must be greater than 0');
    }
    if (leakRate <= 0) {
      throw new Error('Leak rate must be greater than 0');
    }
  }

  async check(key: string, storage: RateLimitStorage): Promise<boolean> {
    const now = Date.now() / 1000; // Convert to seconds
    const storageKey = `leaky:${key}`;

    const data = await storage.get(storageKey);
    let bucket: LeakyBucketData;

    if (data) {
      try {
        bucket = JSON.parse(data);
      } catch {
        bucket = { level: 0, lastLeakTime: now };
      }
    } else {
      bucket = { level: 0, lastLeakTime: now };
    }

    // Calculate how much has leaked since last check
    const timePassed = now - bucket.lastLeakTime;
    const leaked = timePassed * this.leakRate;
    bucket.level = Math.max(0, bucket.level - leaked);
    bucket.lastLeakTime = now;

    // Check if bucket has room
    if (bucket.level >= this.capacity) {
      // Update storage even if request is rejected (to track leak)
      await storage.set(storageKey, JSON.stringify(bucket), 3600); // 1 hour TTL
      return false;
    }

    // Add one request to the bucket
    bucket.level += 1;
    await storage.set(storageKey, JSON.stringify(bucket), 3600);

    return true;
  }

  async getRemaining(key: string, storage: RateLimitStorage): Promise<number> {
    const now = Date.now() / 1000;
    const storageKey = `leaky:${key}`;

    const data = await storage.get(storageKey);
    if (!data) {
      return this.capacity;
    }

    try {
      const bucket: LeakyBucketData = JSON.parse(data);
      const timePassed = now - bucket.lastLeakTime;
      const leaked = timePassed * this.leakRate;
      const currentLevel = Math.max(0, bucket.level - leaked);
      return Math.max(0, Math.floor(this.capacity - currentLevel));
    } catch {
      return this.capacity;
    }
  }

  async getResetTime(key: string, storage: RateLimitStorage): Promise<number> {
    const now = Date.now() / 1000;
    const storageKey = `leaky:${key}`;

    const data = await storage.get(storageKey);
    if (!data) {
      return now;
    }

    try {
      const bucket: LeakyBucketData = JSON.parse(data);
      const timePassed = now - bucket.lastLeakTime;
      const leaked = timePassed * this.leakRate;
      const currentLevel = Math.max(0, bucket.level - leaked);

      if (currentLevel === 0) {
        return now;
      }

      // Calculate when bucket will be empty
      const secondsUntilEmpty = currentLevel / this.leakRate;
      return now + secondsUntilEmpty;
    } catch {
      return now;
    }
  }
}

