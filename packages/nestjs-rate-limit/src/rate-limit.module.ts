import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { RateLimitGuard, RateLimitOptions } from './guards/rate-limit.guard';
import { RateLimitStrategy } from './interfaces/rate-limit-strategy.interface';
import { MemoryStorage } from './storage/memory.storage';
import { RedisStorage, RedisOptions } from './storage/redis.storage';

export interface RateLimitModuleOptions {
  strategy?: RateLimitStrategy;
  storage?: 'memory' | 'redis' | any; // 'memory', 'redis', or custom storage instance
  redisOptions?: RedisOptions;
  keyGenerator?: (context: any) => string;
  errorMessage?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

@Global()
@Module({})
export class RateLimitModule {
  static forRoot(options: RateLimitModuleOptions = {}): DynamicModule {
    // Determine storage
    let storage: any;
    if (options.storage === 'redis' || options.redisOptions) {
      storage = new RedisStorage(options.redisOptions);
    } else if (options.storage && typeof options.storage !== 'string') {
      // Custom storage instance
      storage = options.storage;
    } else {
      // Default to memory
      storage = new MemoryStorage();
    }

    const guardOptions: RateLimitOptions = {
      strategy: options.strategy,
      storage,
      keyGenerator: options.keyGenerator,
      errorMessage: options.errorMessage,
      skipSuccessfulRequests: options.skipSuccessfulRequests,
      skipFailedRequests: options.skipFailedRequests,
    };

    const rateLimitGuardProvider: Provider = {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => {
        return new RateLimitGuard(reflector, guardOptions);
      },
      inject: [Reflector],
    };

    return {
      module: RateLimitModule,
      providers: [rateLimitGuardProvider],
      exports: [RateLimitGuard],
    };
  }
}

