import { ArrowRight, MoveLeft, MoveRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Modal } from '@/components/ui/modal'
import { ConfigSection } from './config-section'
import { ConfigItem } from './config-item'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { useState } from 'react'
import { toast } from 'sonner'
import path from 'path'

export const AppHeader = () => {
  const handleButton = () => {
    // if (location.pathname === '/' || location.pathname === '/home') {
    // } else {
    //   nav('/home')
    // }

    console.log(location)
    console.log('handleButton')
  }

  return (
    <div className="header bg-background-200 h-10 flex items-center gap-8 shrink-0 drag">
      <div
        style={{
          paddingLeft: '81px'
        }}
        className="flex gap-2"
      >
        <SidebarTrigger />

        <Button
          onClick={() => {
            window.history.back()
          }}
          disabled={true}
          className="px-0 text-muted-foreground disabled:text-muted drag-none disabled:bg-background-200 disabled:border-none"
          size={'tiny'}
          shape="square"
          variant={'tertiary'}
        >
          <MoveLeft className="h-4 w-4" />
        </Button>

        <Button
          className="px-0 text-muted-foreground disabled:text-muted drag-none disabled:bg-background-200 disabled:border-none"
          size={'tiny'}
          shape="square"
          disabled={true}
          variant={'tertiary'}
          onClick={() => {
            window.history.forward()
          }}
        >
          <MoveRight className="h-4 w-4 text-muted" />
        </Button>
      </div>
      {/* <div className="flex items-center gap-2 min-w-0 w-full">
        <div className="flex flex-shrink gap-2 w-full">
          <div className=" w-full flex justify-center items-center">
            <span className="[app-region:no-drag;] cursor-default">{'namel'}</span>
          </div>
        </div>
      </div> */}

      <div className="flex-1 flex flex-row items-center gap-2 mr-4">
        {/* {step && step !== 'DONE' ? (
          <Gauge size="tiny" value={calcPercentForStep(step)} />
        ) : (
          <MenuContainer>
            <MenuButton variant={'tertiary'} size={'tiny'} className="[app-region:no-drag;]">
              <Plus className="w-4 h-4" />
            </MenuButton>

            <Menu
              side="bottom"
              collisionPadding={{
                right: 20
              }}
            >
              <MenuItem onClick={handleButton} className="gap-2 h-9 text-sm">
                <Plus className="w-4 h-4" />
                New
              </MenuItem>
            </Menu>
          </MenuContainer>
        )}

        {step === 'DONE' && <ExportDialog />} */}
      </div>
    </div>
  )
}
