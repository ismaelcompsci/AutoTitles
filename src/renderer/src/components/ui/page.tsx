import { cn } from '@/lib/utils'
import React from 'react'

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface PageBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative z-0 flex size-full flex-col overflow-hidden', className)}
      {...props}
    >
      {children}
    </div>
  )
)

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        'drag px-4 min-h-9 border-b-[0.5px] gap-3 max-w-full flex items-center text-xs font-medium',
        className
      )}
      {...props}
    >
      {children}
    </header>
  )
)

export const PageBody = React.forwardRef<HTMLDivElement, PageBodyProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('size-full overflow-hidden px-4', className)} {...props}>
      {children}
    </div>
  )
)

const Page = {
  Root: PageContainer,
  Header: PageHeader,
  Body: PageBody
} as const

export { Page }
