import React, { Suspense, useEffect, useRef, useState } from 'react'
import './App.scss'
import Loading from './components/Loading'
import { preview } from 'vite'

const HomePage = React.lazy(() => import('./HomePage'))

function App() {
  const mouse = { x: 0, y: 0 }
  const previousMouse = { x: 0, y: 0 }
  const circle = { x: 0, y: 0 }
  const speed = 0.17
  const [currentScale,setCurrentScale] = useState(0)
  const [currentAngle,setCurrentAngle] = useState(0)
  const circleElement = useRef()
  const handleMouseMove = (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  }
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    const tick = () => {
      if (circleElement.current) { 
        circle.x += (mouse.x - circle.x) * speed
        circle.y += (mouse.y - circle.y) * speed
        const translateTransform = `translate(${circle.x}px, ${circle.y}px)`

        const deltaMouseX = mouse.x - previousMouse.x
        const deltaMouseY = mouse.y - previousMouse.y
        const mouseVelocity = Math.min(Math.sqrt(deltaMouseX**2 + deltaMouseY**2) * 4, 150)
        const scaleValue = (mouseVelocity / 150) * 0.5
        setCurrentScale(prevScale => prevScale + (scaleValue - prevScale) * speed)
        const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`

        const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI
        if (mouseVelocity > 20)
          setCurrentAngle(angle)
        const rotateTransform = `rotate(${currentAngle}deg)`

        circleElement.current.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`
      }
      window.requestAnimationFrame(tick)
    }
    tick()
    return () => {
        window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [currentScale])
 return(
  <div className='App'>
    <div className="circle" ref={circleElement}></div>
    <Suspense fallback={<Loading />}>
      <HomePage />
    </Suspense>
  </div>
 )
}

export default App

