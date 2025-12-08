import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Strategies() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Rate Limiting Strategies</h1>
        <p className="text-muted-foreground mt-2">
          Choose the right algorithm for your use case. Each strategy has different characteristics
          and is suited for different scenarios.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Sliding Window Strategy</h2>
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Allows X requests per time window. The window slides continuously, providing
              smooth rate limiting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Constructor:</p>
              <CodeBlock>{`new SlidingWindowStrategy(limit: number, windowSeconds: number)`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Parameters:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li><code className="bg-muted px-1 rounded">limit</code> - Maximum number of requests allowed</li>
                <li><code className="bg-muted px-1 rounded">windowSeconds</code> - Time window in seconds</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Example:</p>
              <CodeBlock>{`import { SlidingWindowStrategy } from '@rate-limitter/nestjs-rate-limit';

// Allow 100 requests per 60 seconds
const strategy = new SlidingWindowStrategy(100, 60);

// Allow 10 requests per minute
const strategy = new SlidingWindowStrategy(10, 60);

// Allow 1000 requests per hour
const strategy = new SlidingWindowStrategy(1000, 3600);`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Use Cases:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>API rate limiting with fixed quotas</li>
                <li>Preventing abuse with clear time windows</li>
                <li>Simple rate limiting requirements</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Leaky Bucket Strategy</h2>
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Implements the leaky bucket algorithm. Requests fill the bucket, and it leaks
              at a constant rate. If the bucket is full, requests are rejected.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Constructor:</p>
              <CodeBlock>{`new LeakyBucketStrategy(capacity: number, leakRate: number)`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Parameters:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li><code className="bg-muted px-1 rounded">capacity</code> - Maximum capacity of the bucket</li>
                <li><code className="bg-muted px-1 rounded">leakRate</code> - Number of requests that leak per second</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Example:</p>
              <CodeBlock>{`import { LeakyBucketStrategy } from '@rate-limitter/nestjs-rate-limit';

// Bucket with capacity of 10, leaks 1 request per second
const strategy = new LeakyBucketStrategy(10, 1);

// Bucket with capacity of 100, leaks 5 requests per second
const strategy = new LeakyBucketStrategy(100, 5);

// Allows bursts up to capacity, then smooths out to leak rate
const strategy = new LeakyBucketStrategy(50, 2);`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Use Cases:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>When you want to allow bursts but smooth out traffic</li>
                <li>Preventing sudden spikes while allowing steady flow</li>
                <li>Traffic shaping and smoothing</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Token Bucket Strategy</h2>
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Implements the token bucket algorithm. Tokens are added to the bucket at a
              constant rate. Each request consumes a token. If no tokens are available,
              requests are rejected.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Constructor:</p>
              <CodeBlock>{`new TokenBucketStrategy(capacity: number, refillRate: number)`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Parameters:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li><code className="bg-muted px-1 rounded">capacity</code> - Maximum number of tokens in the bucket</li>
                <li><code className="bg-muted px-1 rounded">refillRate</code> - Number of tokens added per second</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Example:</p>
              <CodeBlock>{`import { TokenBucketStrategy } from '@rate-limitter/nestjs-rate-limit';

// Bucket with 10 tokens, refills at 2 tokens per second
const strategy = new TokenBucketStrategy(10, 2);

// Bucket with 100 tokens, refills at 10 tokens per second
const strategy = new TokenBucketStrategy(100, 10);

// Allows bursts up to capacity, then refills at constant rate
const strategy = new TokenBucketStrategy(50, 5);`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Use Cases:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>When you want to allow bursts of requests</li>
                <li>API rate limiting with token-based systems</li>
                <li>Bandwidth throttling</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Strategy Comparison</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Strategy</th>
                    <th className="text-left p-2">Burst Handling</th>
                    <th className="text-left p-2">Traffic Smoothing</th>
                    <th className="text-left p-2">Complexity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Sliding Window</td>
                    <td className="p-2 text-muted-foreground">No</td>
                    <td className="p-2 text-muted-foreground">No</td>
                    <td className="p-2 text-muted-foreground">Low</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Leaky Bucket</td>
                    <td className="p-2 text-muted-foreground">Yes (limited)</td>
                    <td className="p-2 text-muted-foreground">Yes</td>
                    <td className="p-2 text-muted-foreground">Medium</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Token Bucket</td>
                    <td className="p-2 text-muted-foreground">Yes</td>
                    <td className="p-2 text-muted-foreground">No</td>
                    <td className="p-2 text-muted-foreground">Medium</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

