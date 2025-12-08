import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function GettingStarted() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Getting Started</h1>
        <p className="text-muted-foreground mt-2">
          Learn how to install and configure the NestJS Rate Limiter package in your application.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <Card>
          <CardHeader>
            <CardTitle>NPM</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock>npm install @rate-limitter/nestjs-rate-limit</CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yarn</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock>yarn add @rate-limitter/nestjs-rate-limit</CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PNPM</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock>pnpm add @rate-limitter/nestjs-rate-limit</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Setup</h2>
        <Card>
          <CardHeader>
            <CardTitle>Import the Module</CardTitle>
            <CardDescription>
              Add RateLimitModule to your AppModule imports
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
        <h2 className="text-2xl font-semibold">Storage Options</h2>
        <Tabs defaultValue="memory">
          <TabsList>
            <TabsTrigger value="memory">In-Memory (Default)</TabsTrigger>
            <TabsTrigger value="redis">Redis</TabsTrigger>
          </TabsList>

          <TabsContent value="memory">
            <Card>
              <CardHeader>
                <CardTitle>In-Memory Storage</CardTitle>
                <CardDescription>
                  Default storage option, perfect for single-instance applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock>{`import { Module } from '@nestjs/common';
import { RateLimitModule, SlidingWindowStrategy } from '@rate-limitter/nestjs-rate-limit';

@Module({
  imports: [
    RateLimitModule.forRoot({
      strategy: new SlidingWindowStrategy(100, 60),
      // storage defaults to 'memory'
    }),
  ],
})
export class AppModule {}`}</CodeBlock>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="redis">
            <Card>
              <CardHeader>
                <CardTitle>Redis Storage</CardTitle>
                <CardDescription>
                  Use Redis for distributed rate limiting across multiple instances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">First, install ioredis:</p>
                    <CodeBlock>npm install ioredis</CodeBlock>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Then configure Redis storage:</p>
                    <CodeBlock>{`import { Module } from '@nestjs/common';
import { RateLimitModule, SlidingWindowStrategy } from '@rate-limitter/nestjs-rate-limit';

@Module({
  imports: [
    RateLimitModule.forRoot({
      strategy: new SlidingWindowStrategy(100, 60),
      storage: 'redis',
      redisOptions: {
        host: 'localhost',
        port: 6379,
        password: 'your-password', // optional
        db: 0, // optional
        keyPrefix: 'rate-limit:', // optional
      },
    }),
  ],
})
export class AppModule {}`}</CodeBlock>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Using Custom Redis Client</h2>
        <Card>
          <CardHeader>
            <CardTitle>Pass Your Own Redis Instance</CardTitle>
            <CardDescription>
              If you already have a Redis client configured, you can pass it directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Module } from '@nestjs/common';
import { RateLimitModule, SlidingWindowStrategy, RedisStorage } from '@rate-limitter/nestjs-rate-limit';
import Redis from 'ioredis';

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
});

@Module({
  imports: [
    RateLimitModule.forRoot({
      strategy: new SlidingWindowStrategy(100, 60),
      storage: new RedisStorage({ client: redisClient }),
    }),
  ],
})
export class AppModule {}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Next Steps</h2>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Now that you have the basic setup, you can:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
            <li>Learn about different <a href="/strategies" className="text-primary hover:underline">rate limiting strategies</a></li>
            <li>Configure <a href="/configuration" className="text-primary hover:underline">route and controller-level limits</a></li>
            <li>Check out <a href="/examples" className="text-primary hover:underline">real-world examples</a></li>
            <li>Read the <a href="/api-reference" className="text-primary hover:underline">API reference</a></li>
          </ul>
        </div>
      </section>
    </div>
  )
}

