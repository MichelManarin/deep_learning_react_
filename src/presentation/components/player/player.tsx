import React, { useContext, memo } from 'react'
import Context from '@/presentation/contexts/form/form-context'

const Player: React.FC = () => {
  const { videoRef, videoFile, widthVideo, heightVideo, handleTimeUpdate } =
    useContext(Context)
  return (
    <>
      <div className='relative'>
        <div className='absolute top-0 left-0 w-full h-full'>
          {videoFile && (
            <div className='outsideWrapper'>
              <div className='insideWrapper'>
                <video
                  ref={videoRef}
                  className='coveredImage'
                  id='video-player'
                  width={widthVideo}
                  height={heightVideo}
                  controls={false}
                  onTimeUpdate={handleTimeUpdate}
                >
                  <source
                    src={URL.createObjectURL(videoFile)}
                    type='video/mp4'
                  />
                </video>
              </div>
            </div>
          )}
        </div>
        {videoFile && (
          <div className='relative z-10'>
            <canvas id='c' width={widthVideo} height={heightVideo}></canvas>
          </div>
        )}
      </div>
    </>
  )
}

export default memo(Player)
