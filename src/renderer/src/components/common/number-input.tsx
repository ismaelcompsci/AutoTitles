import { Minus, Plus } from 'lucide-react'
import { Button, Group, Input, Label, NumberField } from 'react-aria-components'

export default function NumberInput({
  value,
  onChange
}: {
  value: number
  onChange: (value: number) => void
}) {
  return (
    <NumberField
      key={value ?? 'key-number_input'}
      defaultValue={value}
      minValue={0}
      maxValue={100}
      onChange={onChange}
    >
      <div className="space-y-2">
        <Group className="relative inline-flex h-9 items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
          <Label hidden className="text-sm font-medium text-foreground">
            Number input with plus/minus buttons
          </Label>
          <Button
            slot="decrement"
            className="bg-background-100 -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Minus size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
          <Input className="bg-background-100 max-w-14 px-3 py-2 text-center tabular-nums text-foreground focus:outline-none" />
          <Button
            slot="increment"
            className="bg-background-100 -me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-lg border border-input text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </Group>
      </div>
    </NumberField>
  )
}
