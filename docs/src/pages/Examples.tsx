import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Examples() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Examples</h1>
        <p className="text-muted-foreground mt-2">
          Real-world examples showing how to use the NestJS Rate Limiter in different scenarios.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic API Rate Limiting</h2>
        <Card>
          <CardHeader>
            <CardTitle>Simple REST API</CardTitle>
            <CardDescription>
              Basic setup for a REST API with global rate limiting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Module } from '@nestjs/common';
import { Controller, Get, Post } from '@nestjs/common';
import { RateLimitModule, SlidingWindowStrategy } from '@rate-limitter/nestjs-rate-limit';

@Module({
  imports: [
    RateLimitModule.forRoot({
      strategy: new SlidingWindowStrategy(100, 60), // 100 requests per minute
    }),
  ],
  controllers: [ApiController],
})
export class AppModule {}

@Controller('api')
export class ApiController {
  @Get('users')
  getUsers() {
    return { users: [] };
  }

  @Post('users')
  createUser() {
    return { message: 'User created' };
  }
}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">E-commerce API</h2>
        <Card>
          <CardHeader>
            <CardTitle>Different Limits for Different Endpoints</CardTitle>
            <CardDescription>
              Apply stricter limits to sensitive operations like checkout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Controller, Get, Post } from '@nestjs/common';
import { RateLimit, SlidingWindowStrategy, TokenBucketStrategy } from '@rate-limitter/nestjs-rate-limit';

@RateLimit(new SlidingWindowStrategy(100, 60)) // Default: 100/min
@Controller('products')
export class ProductsController {
  @Get()
  findAll() {
    return { products: [] };
  }

  @Get(':id')
  findOne() {
    return { product: {} };
  }
}

@Controller('checkout')
export class CheckoutController {
  // Stricter limit for checkout: 10 requests per minute
  @RateLimit(new SlidingWindowStrategy(10, 60))
  @Post()
  checkout() {
    return { order: {} };
  }
}

@Controller('auth')
export class AuthController {
  // Very strict limit for login: 5 requests per minute
  @RateLimit(new SlidingWindowStrategy(5, 60))
  @Post('login')
  login() {
    return { token: '...' };
  }

  // Token bucket for registration: allows bursts
  @RateLimit(new TokenBucketStrategy(3, 0.1)) // 3 tokens, refills 1 every 10 seconds
  @Post('register')
  register() {
    return { user: {} };
  }
}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Distributed System with Redis</h2>
        <Card>
          <CardHeader>
            <CardTitle>Multi-Instance Rate Limiting</CardTitle>
            <CardDescription>
              Use Redis to share rate limit state across multiple application instances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Module } from '@nestjs/common';
import { RateLimitModule, SlidingWindowStrategy } from '@rate-limitter/nestjs-rate-limit';

@Module({
  imports: [
    RateLimitModule.forRoot({
      strategy: new SlidingWindowStrategy(1000, 3600), // 1000 requests per hour
      storage: 'redis',
      redisOptions: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        keyPrefix: 'api-rate-limit:',
      },
    }),
  ],
})
export class AppModule {}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">User-Based Rate Limiting</h2>
        <Card>
          <CardHeader>
            <CardTitle>Rate Limit by User ID</CardTitle>
            <CardDescription>
              Apply rate limits based on authenticated user instead of IP address
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
        const user = request.user; // Assuming you have user from auth guard
        
        if (user?.id) {
          return \`user:\${user.id}\`;
        }
        
        // Fallback to IP for unauthenticated requests
        return request.ip || 'anonymous';
      },
    }),
  ],
})
export class AppModule {}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">API Key Rate Limiting</h2>
        <Card>
          <CardHeader>
            <CardTitle>Rate Limit by API Key</CardTitle>
            <CardDescription>
              Different rate limits for different API key tiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Module } from '@nestjs/common';
import { Controller, Get, Headers } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { RateLimitModule, RateLimit, SlidingWindowStrategy, TokenBucketStrategy } from '@rate-limitter/nestjs-rate-limit';

@Module({
  imports: [
    RateLimitModule.forRoot({
      strategy: new SlidingWindowStrategy(10, 60), // Default: 10/min
      keyGenerator: (context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        return apiKey || request.ip || 'anonymous';
      },
    }),
  ],
  controllers: [ApiController],
})
export class AppModule {}

@Controller('api')
export class ApiController {
  // Premium tier: 1000 requests per minute
  @RateLimit(new SlidingWindowStrategy(1000, 60))
  @Get('premium')
  getPremiumData(@Headers('x-api-key') apiKey: string) {
    // Verify API key tier in your service
    return { data: 'premium' };
  }

  // Free tier: 100 requests per minute
  @RateLimit(new SlidingWindowStrategy(100, 60))
  @Get('free')
  getFreeData() {
    return { data: 'free' };
  }
}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">File Upload Rate Limiting</h2>
        <Card>
          <CardHeader>
            <CardTitle>Strict Limits for File Operations</CardTitle>
            <CardDescription>
              Use leaky bucket to smooth out file upload traffic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RateLimit, LeakyBucketStrategy } from '@rate-limitter/nestjs-rate-limit';

@Controller('upload')
export class UploadController {
  // Allow bursts of 5 uploads, but smooth to 1 per 10 seconds
  @RateLimit(new LeakyBucketStrategy(5, 0.1))
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { message: 'File uploaded', filename: file.filename };
  }

  // Stricter limit for large files
  @RateLimit(new LeakyBucketStrategy(2, 0.05)) // 2 capacity, 1 per 20 seconds
  @Post('large-file')
  @UseInterceptors(FileInterceptor('file'))
  uploadLargeFile(@UploadedFile() file: Express.Multer.File) {
    return { message: 'Large file uploaded', filename: file.filename };
  }
}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Webhook Rate Limiting</h2>
        <Card>
          <CardHeader>
            <CardTitle>Rate Limit Webhook Endpoints</CardTitle>
            <CardDescription>
              Use token bucket to allow bursts of webhook events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Controller, Post, Headers, Body } from '@nestjs/common';
import { RateLimit, TokenBucketStrategy } from '@rate-limitter/nestjs-rate-limit';

@Controller('webhooks')
export class WebhookController {
  // Allow bursts of 50 webhooks, refill at 10 per second
  @RateLimit(new TokenBucketStrategy(50, 10))
  @Post('github')
  handleGithubWebhook(@Headers('x-github-event') event: string, @Body() payload: any) {
    // Process webhook
    return { received: true };
  }

  // Stricter limit for payment webhooks
  @RateLimit(new TokenBucketStrategy(20, 5))
  @Post('stripe')
  handleStripeWebhook(@Body() payload: any) {
    // Process payment webhook
    return { received: true };
  }
}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">GraphQL Rate Limiting</h2>
        <Card>
          <CardHeader>
            <CardTitle>Rate Limit GraphQL Resolvers</CardTitle>
            <CardDescription>
              Apply rate limits to GraphQL queries and mutations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Query, Resolver, Mutation } from '@nestjs/graphql';
import { RateLimit, SlidingWindowStrategy, TokenBucketStrategy } from '@rate-limitter/nestjs-rate-limit';

@Resolver()
export class PostsResolver {
  // Read operations: more lenient
  @RateLimit(new SlidingWindowStrategy(100, 60))
  @Query(() => [Post])
  posts() {
    return [];
  }

  // Write operations: stricter
  @RateLimit(new SlidingWindowStrategy(10, 60))
  @Mutation(() => Post)
  createPost() {
    return {};
  }

  // Expensive operations: very strict
  @RateLimit(new TokenBucketStrategy(5, 0.5)) // 5 tokens, refill 1 every 2 seconds
  @Query(() => Analytics)
  analytics() {
    return {};
  }
}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

