import React, { useEffect, useState, useRef } from 'react'
import captureVideoFrame from 'capture-video-frame'
import { fabric } from 'fabric'
import axios from 'axios'

const Player: React.FC = () => {
  const [canvas, setCanvas] = useState(null)
  const [currentTimeResultVideo, setCurrentTimeResultVideo] = useState(null)
  const [currentTimePrevius, setCurrentTimePrevius] = useState(null)

  const videoRef = useRef(null)
  const [userInput, setUserInput] = useState(null)

  const [videoFile, setVideoFile] = useState(null)
  const [detections, setDetections] = useState([])

  const haveDetections = detections && detections.length > 0

  console.log('detections', detections)

  const initCanvas = (): void =>
    new fabric.Canvas('c', {
      height: 500,
      width: 750,
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

          const text = new fabric.Text(detection.class_name, {
            left: Number(detection.box.left) + Number(detection.box.width) / 2,
            top: detection.box.top - 20,
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

    console.log('response >> ', response)

    const detectionsWithTime = response?.data?.data?.map((detection: any) => ({
      ...detection,
      currentTime: currentTime
    }))
    console.log('detectionsWithTime >> ', detectionsWithTime)

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
        path: '123.mp4',
        iou: 0.5,
        confidence: 0.7
      }

      const response = await axios.post(
        'https://deeplearningflaskapi-production.up.railway.app/api/user-input',
        payload
      )

      console.log('response user-input', response)
      setUserInput(90)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen py-4 w-full'>
      <div className="mb-4">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">MP4 (Recommended videos under 10 seconds)</p>
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
                    width='750'
                    height='500'
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
          <canvas id='c' width={750} height={500}></canvas>
        </div>
      </div>
      {!haveDetections && !!userInput && (
        <div role="status">
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading results...</span>
        </div>
      )}
      <div>
        <button className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={async (): Promise<void> => await processFrames()}>Analyse frame</button>
        <button className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" disabled={!haveDetections} onClick={playVideo}>Play with results</button>
      </div>
    </div>
  )
}

export default Player
