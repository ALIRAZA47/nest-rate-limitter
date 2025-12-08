import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Configuration() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Configuration</h1>
        <p className="text-muted-foreground mt-2">
          Learn how to configure rate limits at different levels: global, controller, and route.
          Priority order: Route &gt; Controller &gt; Global.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Priority System</h2>
        <Card>
          <CardHeader>
            <CardTitle>How Priority Works</CardTitle>
            <CardDescription>
              Rate limits are applied in the following order of precedence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li><strong>Route-level:</strong> Applied to individual routes/methods</li>
              <li><strong>Controller-level:</strong> Applied to all routes in a controller</li>
              <li><strong>Global-level:</strong> Applied to all routes in the application</li>
            </ol>
            <p className="text-sm text-muted-foreground mt-4">
              If a route has a rate limit decorator, it will use that instead of the controller
              or global limit. This allows you to have fine-grained control over rate limiting.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Global Configuration</h2>
        <Card>
          <CardHeader>
            <CardTitle>Module-Level Setup</CardTitle>
            <CardDescription>
              Configure rate limiting for your entire application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Module } from '@nestjs/common';
import { RateLimitModule, SlidingWindowStrategy } from '@rate-limitter/nestjs-rate-limit';

@Module({
  imports: [
    RateLimitModule.forRoot({
      strategy: new SlidingWindowStrategy(100, 60), // 100 requests per 60 seconds
    }),
  ],
})
export class AppModule {}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Controller-Level Configuration</h2>
        <Card>
          <CardHeader>
            <CardTitle>Apply to Entire Controller</CardTitle>
            <CardDescription>
              Apply rate limiting to all routes in a controller
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Controller, Get } from '@nestjs/common';
import { RateLimit, LeakyBucketStrategy } from '@rate-limitter/nestjs-rate-limit';

@RateLimit(new LeakyBucketStrategy(10, 1))
@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return { users: [] };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { user: { id } };
  }
}`}</CodeBlock>
            <p className="text-sm text-muted-foreground mt-4">
              All routes in this controller will use the LeakyBucketStrategy with capacity 10
              and leak rate of 1 per second, unless overridden by route-level decorators.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Route-Level Configuration</h2>
        <Card>
          <CardHeader>
            <CardTitle>Apply to Individual Routes</CardTitle>
            <CardDescription>
              Apply rate limiting to specific routes, overriding controller and global limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Controller, Get } from '@nestjs/common';
import { RateLimit, TokenBucketStrategy, LeakyBucketStrategy } from '@rate-limitter/nestjs-rate-limit';

@RateLimit(new LeakyBucketStrategy(10, 1))
@Controller('users')
export class UsersController {
  // This route uses TokenBucketStrategy (route-level overrides controller-level)
  @RateLimit(new TokenBucketStrategy(5, 1))
  @Get('profile')
  getProfile() {
    return { profile: {} };
  }

  // This route uses LeakyBucketStrategy from controller (no route-level decorator)
  @Get('all')
  getAllUsers() {
    return { users: [] };
  }
}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Complete Example</h2>
        <Card>
          <CardHeader>
            <CardTitle>Combining All Levels</CardTitle>
            <CardDescription>
              Example showing global, controller, and route-level rate limiting together
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Module } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import {
  RateLimitModule,
  RateLimit,
  SlidingWindowStrategy,
  LeakyBucketStrategy,
  TokenBucketStrategy,
} from '@rate-limitter/nestjs-rate-limit';

// Global: 100 requests per 60 seconds
@Module({
  imports: [
    RateLimitModule.forRoot({
      strategy: new SlidingWindowStrategy(100, 60),
    }),
  ],
})
export class AppModule {}

// Controller: 10 capacity, 1 leak per second
@RateLimit(new LeakyBucketStrategy(10, 1))
@Controller('users')
export class UsersController {
  // Route: 5 tokens, 1 refill per second (overrides controller)
  @RateLimit(new TokenBucketStrategy(5, 1))
  @Get('profile')
  getProfile() {
    return { profile: {} };
  }

  // Route: Uses controller-level limit (LeakyBucketStrategy)
  @Get('all')
  getAllUsers() {
    return { users: [] };
  }
}

// Controller: No controller-level limit, uses global
@Controller('posts')
export class PostsController {
  // Route: Uses global limit (SlidingWindowStrategy)
  @Get()
  findAll() {
    return { posts: [] };
  }

  // Route: Custom limit overrides global
  @RateLimit(new SlidingWindowStrategy(5, 60))
  @Get('popular')
  getPopularPosts() {
    return { posts: [] };
  }
}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Custom Key Generator</h2>
        <Card>
          <CardHeader>
            <CardTitle>Customize Rate Limit Keys</CardTitle>
            <CardDescription>
              By default, rate limits are keyed by IP address. You can customize this behavior.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Module } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { RateLimitModule, SlidingWindowStrategy } from '@rate-limitter/nestjs-rate-limit';

@Module({
  imports: [
    RateLimitModule.forRoot({
      strategy: new SlidingWindowStrategy(100, 60),
      keyGenerator: (context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        // Use user ID if authenticated, otherwise use IP
        return request.user?.id || request.ip || 'anonymous';
      },
    }),
  ],
})
export class AppModule {}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Custom Error Message</h2>
        <Card>
          <CardHeader>
            <CardTitle>Customize Rate Limit Error</CardTitle>
            <CardDescription>
              Change the error message returned when rate limit is exceeded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Module } from '@nestjs/common';
import { RateLimitModule, SlidingWindowStrategy } from '@rate-limitter/nestjs-rate-limit';

@Module({
  imports: [
    RateLimitModule.forRoot({
      strategy: new SlidingWindowStrategy(100, 60),
      errorMessage: 'Rate limit exceeded. Please try again later.',
    }),
  ],
})
export class AppModule {}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

