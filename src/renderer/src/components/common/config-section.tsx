interface ConfigSectionProps {
  title: string
  children: React.ReactNode
}

export const ConfigSection = ({ title, children }: ConfigSectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      <span>{title}</span>
      <div className="border rounded-md bg-background-100">
        <div className="px-4">{children}</div>
      </div>
    </div>
  )
}
