import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_KEY } from '../decorators/rate-limit.decorator';
import { RateLimitStrategy, RateLimitStorage } from '../interfaces/rate-limit-strategy.interface';

export interface RateLimitOptions {
  strategy?: RateLimitStrategy;
  storage?: RateLimitStorage;
  keyGenerator?: (context: ExecutionContext) => string;
  errorMessage?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly options: RateLimitOptions,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Determine strategy with priority: Route > Controller > Global
    const routeStrategy = this.reflector.get<RateLimitStrategy>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );
    const controllerStrategy = this.reflector.get<RateLimitStrategy>(
      RATE_LIMIT_KEY,
      context.getClass(),
    );
    const globalStrategy = this.options.strategy;

    const strategy = routeStrategy || controllerStrategy || globalStrategy;

    if (!strategy) {
      return true; // No rate limiting configured
    }

    if (!this.options.storage) {
      throw new Error('Rate limit storage is not configured');
    }

    // Generate key for this request
    const keyGenerator = this.options.keyGenerator || this.defaultKeyGenerator;
    const key = keyGenerator(context);

    // Check rate limit
    const allowed = await strategy.check(key, this.options.storage);

    if (!allowed) {
      const remaining = await strategy.getRemaining(key, this.options.storage);
      const resetTime = await strategy.getResetTime(key, this.options.storage);

      // Set rate limit headers
      response.setHeader('X-RateLimit-Limit', 'N/A'); // Strategy-specific
      response.setHeader('X-RateLimit-Remaining', Math.max(0, remaining));
      response.setHeader('X-RateLimit-Reset', resetTime);

      const errorMessage =
        this.options.errorMessage || 'Too Many Requests';
      throw new HttpException(errorMessage, HttpStatus.TOO_MANY_REQUESTS);
    }

    // Set rate limit headers for successful requests
    const remaining = await strategy.getRemaining(key, this.options.storage);
    const resetTime = await strategy.getResetTime(key, this.options.storage);
    response.setHeader('X-RateLimit-Remaining', remaining);
    response.setHeader('X-RateLimit-Reset', resetTime);

    return true;
  }

  private defaultKeyGenerator(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    // Default: use IP address
    return (
      request.ip ||
      request.connection?.remoteAddress ||
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      'unknown'
    );
  }
}

