import { motion, PanInfo, useMotionValue } from 'motion/react'
import { GripHorizontal } from 'lucide-react'
import { useRef } from 'react'

export const ResizablePanel = ({
  children,
  minSize,
  defaultSize
}: {
  children: React.ReactNode
  minSize: number
  defaultSize: number
}) => {
  const isDragging = useRef(false)
  const size = useRef(defaultSize)
  const currentSizeM = useMotionValue(size.current)

  const handleDragStart = (event: PointerEvent, info: PanInfo) => {
    isDragging.current = true
  }
  const handleDrag = (event: PointerEvent, info: PanInfo) => {
    const currentSize = size.current - info.offset.y

    currentSizeM.set(Math.max(minSize, currentSize))
  }
  const handleDragEnd = (event: PointerEvent, info: PanInfo) => {
    size.current = Math.max(minSize, currentSizeM.get())
    isDragging.current = false
  }

  return (
    <div className="flex flex-col">
      <motion.div
        onPanStart={handleDragStart}
        onPan={handleDrag}
        onPanEnd={handleDragEnd}
        initial={false}
        whileHover={{ opacity: 1, transition: { ease: 'easeInOut', duration: 0.2 } }}
        whileTap={{ opacity: 1 }}
        transition={{ ease: 'easeInOut', duration: 0.2 }}
        style={{ opacity: 0 }}
        className="h-px cursor-row-resize group relative z-20"
      >
        <motion.div className="-top-[1px] absolute inset-0 flex justify-center">
          <div className="bg-background-200 h-2 w-5 rounded-sm absolute" />
          <GripHorizontal className="h-2 w-2 absolute" />
        </motion.div>
      </motion.div>
      {/*  */}
      <motion.div
        layout
        transition={{ type: 'ease', ease: 'easeInOut', duration: 0.2 }}
        style={{
          height: currentSizeM
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
