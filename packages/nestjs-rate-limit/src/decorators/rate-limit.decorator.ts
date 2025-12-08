import { SetMetadata } from '@nestjs/common';
import { RateLimitStrategy } from '../interfaces/rate-limit-strategy.interface';

export const RATE_LIMIT_KEY = 'rateLimit';

/**
 * Decorator to apply rate limiting to a route, controller, or globally
 * Priority: Route > Controller > Global
 */
export const RateLimit = (strategy: RateLimitStrategy) =>
  SetMetadata(RATE_LIMIT_KEY, strategy);

