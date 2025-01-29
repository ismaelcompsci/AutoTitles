import { useWavesurfer } from '../common/wavesurfer-provider'

export const VideoPlayer = () => {
  const { videoRef } = useWavesurfer()

  return (
    <div id="media-display-top" className="w-full flex justify-center py-2">
      <video
        ref={videoRef}
        loop
        playsInline
        className="aspect-video h-52 rounded-lg bg-black"
        controls={false}
      ></video>
    </div>
  )
}
