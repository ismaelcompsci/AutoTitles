import { cn } from '@/lib/utils'

interface ConfigItemProps {
  label: string
  sublabel?: string
  children: React.ReactNode
  className?: string
  divider?: boolean
}

export const ConfigItem = ({
  label,
  sublabel,
  children,
  className = '',
  divider = false
}: ConfigItemProps) => {
  return (
    <div
      className={cn(
        `h-14 flex flex-row items-center gap-1`,
        divider ? 'border-b' : undefined,
        className
      )}
    >
      <div className="flex flex-col">
        <p>{label}</p>
        {sublabel && <p className="text-[10px] text-muted-foreground">{sublabel}</p>}
      </div>
      {children}
    </div>
  )
}
