import React, { useEffect, useState, useRef } from 'react'
import captureVideoFrame from 'capture-video-frame'

import { fabric } from 'fabric'
import { FormContext } from '@/presentation/contexts'
import { Validation } from '@/presentation/protocols/validation'
import { Input, Dropzone, Player } from '@/presentation/components'
import { AddInputUser, AddDetectionResult } from '@/domain/usecases'

type Props = {
  validation: Validation
  addInputUser: AddInputUser
  addDetectionResult: AddDetectionResult
}

const VideoInterative: React.FC<Props> = ({ validation, addInputUser, addDetectionResult }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    iou: 0.5,
    confidence: 0.7
  })

  const stylesDetection = {
    widthVideo: 704,
    heightVideo: 422,
    colorDetection: '#ff0000'
  }

  const videoRef = useRef(null)
  const [canvas, setCanvas] = useState(null)
  const [detections, setDetections] = useState([])
  const [videoFile, setVideoFile] = useState(null)
  const [userInput, setUserInput] = useState(null)
  const [currentTimeResultVideo, setCurrentTimeResultVideo] = useState(null)
  const [currentTimePrevius, setCurrentTimePrevius] = useState(null)

  const haveDetections = detections && detections.length > 0

  const initCanvas = (): void =>
    new fabric.Canvas('c', {
      width: stylesDetection.widthVideo,
      height: stylesDetection.heightVideo,
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
      // eslint-disable-next-line array-callback-return
      filterDetections.map((detection): void => {
        if (canvas) {
          const scaleX = videoRef.current.width / 1280
          const scaleY = videoRef.current.height / 720
          const scaledLeft = Number(detection.box.left) * scaleX
          const scaledTop = Number(detection.box.top) * scaleY
          const scaledWidth = Number(detection.box.width) * scaleX
          const scaledHeight = Number(detection.box.height) * scaleY
          const left = scaledLeft + scaledWidth / 2

          const rect = new fabric.Rect({
            height: scaledHeight,
            width: scaledWidth,
            top: scaledTop,
            left: left,
            fill: 'transparent',
            stroke: stylesDetection.colorDetection,
            strokeWidth: 2,
            selectable: false
          })

          const text = new fabric.Text(detection.class_name, {
            left,
            top: scaledTop,
            fill: stylesDetection.colorDetection,
            selectable: false
          })

          canvas.add(rect, text)
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

    const payload = {
      number_fps: currentTime,
      user_input_id: 90,
      image_base64: base64String
    }

    const response = await addDetectionResult.add(payload)

    const detectionsWithTime = response?.data?.map((detection: any) => ({
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

      const inputUser = await addInputUser.add(payload)
      setUserInput(inputUser?.data)
    }
  }

  return (
    <div className='h-auto bg-gray-50 flex min-h-full flex-1 flex-col justify-center sm:px-6 lg:px-8'>
      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[800px]'>
        <FormContext.Provider value={{ setState, handleFileChange, handleTimeUpdate, state, videoRef, videoFile, stylesDetection }}>
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
              <Dropzone />
            </div>
            <Player />
            {!haveDetections && !!userInput && (
              <div className="mt-3" role="status">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading results</span>
              </div>
            )}
            <div>
              <button className="rounded bg-indigo-500 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 py-3" onClick={async (): Promise<void> => await processFrames()}>Analyse frames</button>
              <button className="rounded bg-indigo-500 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 py-3 ml-2" disabled={!haveDetections} onClick={playVideo}>Play with results</button>
            </div>
          </div>
        </FormContext.Provider>
      </div>
    </div>
  )
}

export default VideoInterative
