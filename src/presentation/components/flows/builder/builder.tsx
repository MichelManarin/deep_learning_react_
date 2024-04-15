import React, { useEffect, useState, useRef } from 'react'
import captureVideoFrame from 'capture-video-frame'
import { fabric } from 'fabric'
import axios from 'axios'

const Player: React.FC = () => {
  const [canvas, setCanvas] = useState(null)
  const [currentTimeResultVideo, setCurrentTimeResultVideo] = useState(null)

  const videoRef = useRef(null)
  const [userInput, setUserInput] = useState(null)

  const [videoFile, setVideoFile] = useState(null)
  const [detections, setDetections] = useState([])

  console.log('detections', detections)

  const initCanvas = (): void =>
    new fabric.Canvas('c', {
      height: 500,
      width: 750
    })

  useEffect(() => {
    const isNecessary = detections && detections.length > 0

    if (isNecessary) {
      if (!canvas) {
        setCanvas(initCanvas())
      }
      const filterDetections = detections.filter((detection) => detection.currentTime === currentTimeResultVideo)
      // const filterDetections = detections

      filterDetections.map((detection): void => {
        if (canvas) {
          const rect = new fabric.Rect({
            height: detection.box.height,
            width: detection.box.width,
            top: detection.box.top,
            left: detection.box.left,
            fill: 'transparent',
            stroke: '#555555',
            strokeWidth: 2,
            selectable: false
          })

          const text = new fabric.Text(detection.class_name, {
            left: Number(detection.box.left) + Number(detection.box.width) / 2,
            top: detection.box.top - 20,
            fill: '#555555',
            selectable: false
          })

          canvas.add(rect, text)
          canvas.renderAll()
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

    if (currentTime > 0) return
    if (frame > 1) return

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

      setUserInput(response.data.data)
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
            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input id="dropzone-file" type="file" accept='video/mp4' onChange={handleFileChange} className="hidden" />
        </label>
      </div>
      <div className="mb-4">
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
              <canvas id='c' className='coveringCanvas'></canvas>
            </div>
          </div>
        )}
      </div>
      <div>
        <button className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={async (): Promise<void> => await processFrames()}>Computar frames</button>
        <button onClick={(): void => playVideo()}>Resultado</button>
      </div>
    </div>
  )
}

export default Player
