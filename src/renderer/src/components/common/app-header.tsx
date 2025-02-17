import { SidebarTrigger } from '@/components/ui/sidebar'
import { HistoryControls } from '../sidebar/app-sidebar'
import { useEffect, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { jobProgressAtom, jobIsRunningAtom } from '@/state/state'
import { motion } from 'motion/react'
import { Progress } from '../ui/progress'
import { AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'

export const AppHeader = () => {
  const setJobProgress = useSetAtom(jobProgressAtom)
  const setJobIsRunning = useSetAtom(jobIsRunningAtom)

  useEffect(() => {
    const subs = [
      window.api.onQueueProgress((jobProgress) => {
        setJobProgress(jobProgress)
      }),
      window.api.onQueueSetRunning((running) => {
        setJobIsRunning(running)
      })
    ]

    return () => {
      subs.forEach((s) => s())
    }
  }, [])

  return (
    <div className="bg-background-200 h-11 relative flex items-center gap-8 shrink-0 drag">
      <div
        style={{
          paddingLeft: '90px'
        }}
        className="flex gap-2 items-center"
      >
        <SidebarTrigger className="drag-none" />

        <HistoryControls />
      </div>

      <div className="absolute inset-y-0 left-1/2 top-[2px] flex -translate-x-1/2 items-center justify-center [-webkit-app-region:no-drag]">
        <JobProgress />
      </div>
    </div>
  )
}

const JobProgress = () => {
  const jobProgress = useAtomValue(jobProgressAtom)
  const jobIsRunning = useAtomValue(jobIsRunningAtom)
  const [isAborting, setIsAborting] = useState(false)

  const abortJob = async () => {
    setIsAborting(true)
    const aborted = await window.api.abortRunningJob()

    if (aborted) {
      toast.success('Abort Sucessful!')
    } else {
      toast.error('Something went wrong...')
    }

    setIsAborting(false)
  }

  return (
    <AnimatePresence>
      {jobIsRunning && (
        <motion.div
          initial={{ transform: `translateY(-20px) scale(0.9)`, opacity: 0 }}
          animate={{ transform: `translateY(0px) scale(1)`, opacity: 1, filter: 'blur(0px)' }}
          exit={{
            transform: `translateY(-20px) scale(0.9)`,
            opacity: 0,
            filter: 'blur(6px)',
            transition: { type: 'spring', stiffness: 220, damping: 30, delay: 1.8 }
          }}
          transition={{ type: 'spring', stiffness: 440, damping: 28, delay: 0.2 }}
          className="will-change-transform will-change-opacity will-change-filter "
        >
          <motion.div
            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            className="flex h-[29px] select-none items-center gap-3 rounded-full px-[8px] bg-gray-200"
          >
            <div className="flex items-center gap-x-[6px]">
              {jobProgress?.progress === 100 ? (
                <div className="relative flex size-[17px] items-center justify-center rounded-full bg-green-200 p-[3px]">
                  <CheckCircle className="size-full text-green-900" />
                </div>
              ) : (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              <span className="max-w-[300px] truncate text-[11px] font-bold tracking-tight text-muted-foreground">
                {jobProgress?.type}
              </span>
            </div>

            <Progress value={jobProgress?.progress} className={`h-1 w-20`} />

            <Button
              onClick={abortJob}
              size={'tiny'}
              shape="rounded"
              className="text-[10px]"
              variant={'error'}
              disabled={
                isAborting ||
                !jobProgress ||
                jobProgress.type !== 'Transcribe' ||
                jobProgress.progress === 100
              }
            >
              Abort
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
