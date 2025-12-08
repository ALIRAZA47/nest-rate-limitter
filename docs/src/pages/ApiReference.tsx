import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'

export default function ApiReference() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">API Reference</h1>
        <p className="text-muted-foreground mt-2">
          Complete API documentation for all classes, interfaces, and decorators.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">RateLimitModule</h2>
        <Card>
          <CardHeader>
            <CardTitle>forRoot(options?: RateLimitModuleOptions)</CardTitle>
            <CardDescription>Configure the rate limit module globally</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Options:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li><code className="bg-muted px-1 rounded">strategy?: RateLimitStrategy</code> - Global rate limiting strategy</li>
                <li><code className="bg-muted px-1 rounded">storage?: 'memory' | 'redis' | RateLimitStorage</code> - Storage backend</li>
                <li><code className="bg-muted px-1 rounded">redisOptions?: RedisOptions</code> - Redis configuration (if using Redis)</li>
                <li><code className="bg-muted px-1 rounded">keyGenerator?: (context: ExecutionContext) =&gt; string</code> - Custom key generator</li>
                <li><code className="bg-muted px-1 rounded">errorMessage?: string</code> - Custom error message</li>
              </ul>
            </div>
            <CodeBlock>{`RateLimitModule.forRoot({
  strategy: new SlidingWindowStrategy(100, 60),
  storage: 'memory',
  keyGenerator: (context) => context.switchToHttp().getRequest().ip,
  errorMessage: 'Too Many Requests',
})`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Strategies</h2>

        <Card>
          <CardHeader>
            <CardTitle>SlidingWindowStrategy</CardTitle>
            <CardDescription>Allows X requests per time window</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Constructor:</p>
              <CodeBlock>{`new SlidingWindowStrategy(limit: number, windowSeconds: number)`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Methods:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li><code className="bg-muted px-1 rounded">check(key: string, storage: RateLimitStorage): Promise&lt;boolean&gt;</code></li>
                <li><code className="bg-muted px-1 rounded">getRemaining(key: string, storage: RateLimitStorage): Promise&lt;number&gt;</code></li>
                <li><code className="bg-muted px-1 rounded">getResetTime(key: string, storage: RateLimitStorage): Promise&lt;number&gt;</code></li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>LeakyBucketStrategy</CardTitle>
            <CardDescription>Leaky bucket algorithm with capacity and leak rate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Constructor:</p>
              <CodeBlock>{`new LeakyBucketStrategy(capacity: number, leakRate: number)`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Methods:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li><code className="bg-muted px-1 rounded">check(key: string, storage: RateLimitStorage): Promise&lt;boolean&gt;</code></li>
                <li><code className="bg-muted px-1 rounded">getRemaining(key: string, storage: RateLimitStorage): Promise&lt;number&gt;</code></li>
                <li><code className="bg-muted px-1 rounded">getResetTime(key: string, storage: RateLimitStorage): Promise&lt;number&gt;</code></li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TokenBucketStrategy</CardTitle>
            <CardDescription>Token bucket algorithm with capacity and refill rate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Constructor:</p>
              <CodeBlock>{`new TokenBucketStrategy(capacity: number, refillRate: number)`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Methods:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li><code className="bg-muted px-1 rounded">check(key: string, storage: RateLimitStorage): Promise&lt;boolean&gt;</code></li>
                <li><code className="bg-muted px-1 rounded">getRemaining(key: string, storage: RateLimitStorage): Promise&lt;number&gt;</code></li>
                <li><code className="bg-muted px-1 rounded">getResetTime(key: string, storage: RateLimitStorage): Promise&lt;number&gt;</code></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Decorators</h2>
        <Card>
          <CardHeader>
            <CardTitle>@RateLimit(strategy: RateLimitStrategy)</CardTitle>
            <CardDescription>Apply rate limiting to a route or controller</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`// Route-level
@RateLimit(new SlidingWindowStrategy(10, 60))
@Get('profile')
getProfile() {}

// Controller-level
@RateLimit(new LeakyBucketStrategy(100, 5))
@Controller('users')
export class UsersController {}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Storage</h2>

        <Card>
          <CardHeader>
            <CardTitle>MemoryStorage</CardTitle>
            <CardDescription>In-memory storage implementation</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { MemoryStorage } from '@rate-limitter/nestjs-rate-limit';

const storage = new MemoryStorage();`}</CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RedisStorage</CardTitle>
            <CardDescription>Redis storage implementation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Constructor:</p>
              <CodeBlock>{`new RedisStorage(options?: RedisOptions)`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Options:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li><code className="bg-muted px-1 rounded">host?: string</code> - Redis host (default: 'localhost')</li>
                <li><code className="bg-muted px-1 rounded">port?: number</code> - Redis port (default: 6379)</li>
                <li><code className="bg-muted px-1 rounded">password?: string</code> - Redis password</li>
                <li><code className="bg-muted px-1 rounded">db?: number</code> - Redis database (default: 0)</li>
                <li><code className="bg-muted px-1 rounded">keyPrefix?: string</code> - Key prefix (default: 'rate-limit:')</li>
                <li><code className="bg-muted px-1 rounded">client?: any</code> - Existing Redis client instance</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Interfaces</h2>

        <Card>
          <CardHeader>
            <CardTitle>RateLimitStrategy</CardTitle>
            <CardDescription>Interface for rate limiting strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`interface RateLimitStrategy {
  check(key: string, storage: RateLimitStorage): Promise<boolean>;
  getRemaining(key: string, storage: RateLimitStorage): Promise<number>;
  getResetTime(key: string, storage: RateLimitStorage): Promise<number>;
}`}</CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RateLimitStorage</CardTitle>
            <CardDescription>Interface for storage backends</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`interface RateLimitStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  increment(key: string, ttl?: number): Promise<number>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">HTTP Headers</h2>
        <Card>
          <CardHeader>
            <CardTitle>Response Headers</CardTitle>
            <CardDescription>Headers included in rate-limited responses</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm ml-4">
              <li>
                <code className="bg-muted px-1 rounded">X-RateLimit-Remaining</code> - Number of remaining requests/tokens
              </li>
              <li>
                <code className="bg-muted px-1 rounded">X-RateLimit-Reset</code> - Unix timestamp when the rate limit resets
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              These headers are included in all responses, whether the rate limit was exceeded or not.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Error Responses</h2>
        <Card>
          <CardHeader>
            <CardTitle>429 Too Many Requests</CardTitle>
            <CardDescription>Response when rate limit is exceeded</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699123456

{
  "statusCode": 429,
  "message": "Too Many Requests"
}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

