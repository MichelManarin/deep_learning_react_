import React, { useEffect, useState, useRef } from 'react'
import captureVideoFrame from 'capture-video-frame'
import { FormContext } from '@/presentation/contexts'
import { Input } from '@/presentation/components'
import { Link } from 'react-router-dom'
import { fabric } from 'fabric'
import axios from 'axios'

const Player: React.FC = () => {
  const widthVideo = 750
  const heightVideo = 422

  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    iou: 0,
    confidence: 0
  })
  const videoRef = useRef(null)
  const [canvas, setCanvas] = useState(null)
  const [detections, setDetections] = useState([])
  const [videoFile, setVideoFile] = useState(null)
  const [userInput, setUserInput] = useState(null)
  const [currentTimeResultVideo, setCurrentTimeResultVideo] = useState(null)
  const [currentTimePrevius, setCurrentTimePrevius] = useState(null)

  console.log('videofile ', videoFile)

  const haveDetections = detections && detections.length > 0

  const initCanvas = (): void =>
    new fabric.Canvas('c', {
      width: widthVideo,
      height: heightVideo,
      backgroundColor: 'transparent'
    })

  useEffect(() => {
    const isNecessary = detections && detections.length > 0

    if (isNecessary) {
      if (!canvas) {
        setCanvas(initCanvas())
      }
      const filterDetections = detections.filter((detection) => detection.currentTime === currentTimeResultVideo)

      if (!canvas) {
        return
      }
      canvas.clear()
      filterDetections.map((detection): void => {
        if (canvas) {
          // const rect = new fabric.Rect({
          //   height: detection.box.height,
          //   width: detection.box.width,
          //   fill: 'transparent',
          //   stroke: '#ff0000',
          //   strokeWidth: 2,
          //   selectable: false
          // })

          const scaleX = videoRef.current.displayWidth / videoRef.current.videoWidth
          const scaleY = videoRef.current.displayHeight / videoRef.current.videoHeight

          const scaledLeft = Number(detection.box.left) * scaleX
          const scaledTop = Number(detection.box.top) * scaleY
          const scaledWidth = Number(detection.box.width) * scaleX
          // const scaledHeight = Number(detection.box.height) * scaleY

          const text = new fabric.Text(detection.class_name, {
            left: scaledLeft + scaledWidth / 2,
            top: scaledTop,
            fill: '#ff0000',
            selectable: false
          })

          canvas.add(text)
        }
      })
    }
  }, [currentTimeResultVideo])

  const handleFileChange = (event): void => {
    const file = event.target.files[0]
    setVideoFile(file)
  }

  const handleTimeUpdate = async (): Promise<void> => {
    const currentTime = Math.floor(videoRef.current.currentTime)
    setCurrentTimeResultVideo(currentTime)
    const frame = captureVideoFrame(videoRef.current, 'png', 0.4)
    const base64String = frame.dataUri.substring(
      'data:image/pngbase64,'.length
    )

    // make server cheaper
    const mustNotConsiderFrame = currentTime === currentTimePrevius || (currentTimeResultVideo % 2) !== 0
    if (mustNotConsiderFrame) {
      return
    }
    setCurrentTimePrevius(currentTimeResultVideo)

    const payload = JSON.stringify({
      number_fps: currentTime,
      user_input_id: 90,
      image_base64: base64String
    })

    const config = {
      method: 'POST',
      maxBodyLength: Infinity,
      url: 'https://deeplearningflaskapi-production.up.railway.app/api/detection-result',
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    }

    const response = await axios.request(config)

    const detectionsWithTime = response?.data?.data?.map((detection: any) => ({
      ...detection,
      currentTime: currentTime
    }))

    setDetections((prevDetections) => [
      ...prevDetections,
      ...detectionsWithTime
    ])
  }

  const playVideo = (): void => {
    videoRef.current.play()
  }

  const processFrames = async (): Promise<void> => {
    if (videoRef.current) {
      playVideo()

      const payload = {
        path: videoFile?.name ?? 'unknown',
        confidence: Number(state.confidence ?? 0.7),
        iou: Number(state.iou ?? 0.5)
      }

      const response = await axios.post(
        'https://deeplearningflaskapi-production.up.railway.app/api/user-input',
        payload
      )

      if (response && response.status === 200) {
        setUserInput(response?.data?.data)
      }
    }
  }

  return (
    <div className='h-auto bg-gray-50 flex min-h-full flex-1 flex-col justify-center sm:px-6 lg:px-8'>
      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[800px]'>
        <FormContext.Provider value={{ state, setState }}>
          <div className='bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12'>
              <Input
                label='Confidence'
                labelProps={{
                  htmlFor: 'confidence',
                  className:
                    'block text-sm font-medium leading-6 text-gray-900'
                }}
                inputProps={{
                  required: true,
                  id: 'confidence',
                  name: 'confidence',
                  type: 'number',
                  autoComplete: 'confidence',
                  className:
                    'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                }}
              />

              <Input
                label='Iou'
                labelProps={{
                  htmlFor: 'iou',
                  className:
                    'block text-sm font-medium leading-6 text-gray-900'
                }}
                inputProps={{
                  required: true,
                  id: 'iou',
                  name: 'iou',
                  type: 'number',
                  min: '0.1',
                  step: '1.0',
                  autoComplete: '',
                  className:
                    'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-5'
                }}
              />
            <div className="my-4">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full">
                  <svg className="w-10 h-10 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">MP4 - 1280 x 720 (Recommended videos under 10 seconds)</p>
                </div>
                <input id="dropzone-file" type="file" accept='video/mp4' onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-full">
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
                          <source src={URL.createObjectURL(videoFile)} type='video/mp4' />
                        </video>
                      </div>
                    </div>
                )}
              </div>
              <div className="relative z-10">
                <canvas id='c' width={widthVideo} height={heightVideo}></canvas>
              </div>
            </div>
            {!haveDetections && !!userInput && (
              <div role="status">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading results</span>
              </div>
            )}
            <div>
              <button className="rounded bg-white px-2 py-3 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 py-" onClick={async (): Promise<void> => await processFrames()}>Analyse frames</button>
              <button className="rounded bg-white px-2 py-3 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-2" disabled={!haveDetections} onClick={playVideo}>Play with results</button>
            </div>
          </div>
        </FormContext.Provider>
      </div>
      <p className="mt-10 text-center text-sm text-gray-500">
        <Link data-testid="signup-link" to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1">
          Historic
        </Link>
      </p>
    </div>
  )
}

export default Player
