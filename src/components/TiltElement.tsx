import { useState, useEffect } from "react"
import { StyledTilt } from "../styles/styleVolume"
import { SliderComponent } from "./Volume"

const TiltEffect = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [value, setValue] = useState(0)
  const [intervalId, setIntervalId] = useState<number | null>(null)

  useEffect(() => {
    const tiltElem = document.getElementById("tilt")
    if (!tiltElem) return

    const box = tiltElem.getBoundingClientRect()

    const startIncrement = (e: MouseEvent) => {
      const x = e.clientX - box.left
      const centerX = box.width / 2
      const rotateX = 0.25

      const id = setInterval(() => {
        setValue((prevValue) => {
          const newValue = x >= centerX ? prevValue + 1 : prevValue - 1
          const clampedValue = Math.max(0, Math.min(100, newValue))

          if (prevValue === clampedValue) return prevValue

          setRotate({ x: rotateX, y: x >= centerX ? 10 : -10 })
          return clampedValue
        })
      }, 100)
      setIntervalId(id as unknown as number)
    }

    const stopIncrement = () => {
      setRotate({ x: 0, y: 0 })
      if (intervalId) {
        clearInterval(intervalId)
        setIntervalId(null)
      }
    }

    tiltElem.addEventListener("mouseenter", startIncrement)
    tiltElem.addEventListener("mouseleave", stopIncrement)

    return () => {
      tiltElem.removeEventListener("mouseenter", startIncrement)
      tiltElem.removeEventListener("mouseleave", stopIncrement)
      if (intervalId) clearInterval(intervalId)
    }
  }, [intervalId])

  return (
    <StyledTilt id="tilt" data-testid="tilt-wrapper" rotate={rotate}>
      <SliderComponent value={value} />
    </StyledTilt>
  )
}

export default TiltEffect
