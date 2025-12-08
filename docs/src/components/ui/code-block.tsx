import * as React from 'react'
import { cn } from '@/lib/utils'

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  language?: string
}

export function CodeBlock({ className, children, ...props }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        'relative overflow-x-auto rounded-lg bg-muted p-4 text-sm',
        className
      )}
      {...props}
    >
      <code className="font-mono">{children}</code>
    </pre>
  )
}

