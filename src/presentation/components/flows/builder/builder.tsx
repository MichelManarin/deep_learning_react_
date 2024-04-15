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

    axios.request(config)
      .then((response) => {
        const detectionsWithTime = response?.data?.map((detection) => ({
          ...detection,
          currentTime: currentTime
        }))

        setDetections((prevDetections) => [
          ...prevDetections,
          ...detectionsWithTime
        ])
      })
      .catch((error) => {
        console.log(error)
      })
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
    <div className='App'>
      <div>
        <input type='file' accept='video/mp4' onChange={handleFileChange} />

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
      <button onClick={async (): Promise<void> => await processFrames()}>Computar frames</button>
      <button onClick={(): void => playVideo()}>Resultado</button>
    </div>
  )
}

export default Player
