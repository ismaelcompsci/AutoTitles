import './remotion.css'
import { Composition } from 'remotion'
import { CaptionedVideo } from './video/CaptionedVideo'

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          src: '',
          captions: []
        }}
      />
    </>
  )
}
