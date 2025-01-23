import { LaptopIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from '../providers'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex w-fit rounded-full bg-background-100 shadow-border">
      <span className="h-full">
        <input
          className="peer sr-only"
          type="radio"
          id="theme-switch-system"
          value="system"
          checked={theme === 'system'}
          onChange={() => setTheme('dark')}
        />
        <label
          htmlFor="theme-switch-system"
          className="relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-gray-700 peer-checked:text-gray-1000 peer-checked:shadow-border"
        >
          <LaptopIcon className="h-4 w-4" />
        </label>
      </span>
      <span className="h-full">
        <input
          className="peer sr-only"
          type="radio"
          id="theme-switch-light"
          value="light"
          checked={theme === 'light'}
          onChange={() => setTheme('light')}
        />
        <label
          htmlFor="theme-switch-light"
          className="relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-gray-700 peer-checked:text-gray-1000 peer-checked:shadow-border"
        >
          <SunIcon className="h-4 w-4" />
        </label>
      </span>
      <span className="h-full">
        <input
          className="peer sr-only"
          type="radio"
          id="theme-switch-dark"
          value="dark"
          checked={theme === 'dark'}
          onChange={() => setTheme('dark')}
        />
        <label
          htmlFor="theme-switch-dark"
          className="relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-gray-700 peer-checked:text-gray-1000 peer-checked:shadow-border"
        >
          <MoonIcon className="h-4 w-4" />
        </label>
      </span>
    </div>
  )
}
