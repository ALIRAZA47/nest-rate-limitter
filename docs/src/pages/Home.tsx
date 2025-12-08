import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Zap, Shield, Database, Settings } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          NestJS Rate Limiter
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A flexible, production-ready rate-limiting package for NestJS with multiple
          algorithms and Redis support
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link to="/getting-started">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/examples">
            <Button size="lg" variant="outline">View Examples</Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <Zap className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Multiple Algorithms</CardTitle>
            <CardDescription>
              Choose from Sliding Window, Leaky Bucket, or Token Bucket strategies
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Flexible Configuration</CardTitle>
            <CardDescription>
              Apply rate limits globally, at controller level, or per route
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Database className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Redis Support</CardTitle>
            <CardDescription>
              Use Redis for distributed rate limiting across multiple instances
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Settings className="h-8 w-8 text-primary mb-2" />
            <CardTitle>TypeScript First</CardTitle>
            <CardDescription>
              Fully typed with TypeScript for better developer experience
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Quick Start</h2>
        <Card>
          <CardHeader>
            <CardTitle>Installation</CardTitle>
            <CardDescription>Install the package in your NestJS application</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>npm install @rate-limitter/nestjs-rate-limit</CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basic Usage</CardTitle>
            <CardDescription>Set up global rate limiting in your app module</CardDescription>
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

        <Card>
          <CardHeader>
            <CardTitle>Route-Level Rate Limiting</CardTitle>
            <CardDescription>Apply rate limits to specific routes</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock>{`import { Controller, Get } from '@nestjs/common';
import { RateLimit, TokenBucketStrategy } from '@rate-limitter/nestjs-rate-limit';

@Controller('users')
export class UsersController {
  @RateLimit(new TokenBucketStrategy(10, 2))
  @Get('profile')
  getProfile() {
    return { message: 'Profile data' };
  }
}`}</CodeBlock>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Priority System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Route-level rate limits override controller-level, which override global limits.
                This gives you fine-grained control over rate limiting in your application.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Options</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use in-memory storage for single-instance applications or Redis for
                distributed systems. Easily extendable to support other storage backends.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HTTP Headers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automatically includes X-RateLimit-Remaining and X-RateLimit-Reset headers
                in responses to help clients understand their rate limit status.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Key Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Customize how rate limit keys are generated. Default uses IP address, but
                you can use user IDs, API keys, or any other identifier.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

