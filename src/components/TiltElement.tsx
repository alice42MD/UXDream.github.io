import { throttle } from "lodash"
import { useState, MouseEvent, useCallback, useMemo } from "react"
import { StyledTilt } from "../styles/Volume"

export const TiltEffect = ({
  children,
  onTiltElement,
}: {
  children?: JSX.Element
  onTiltElement: (value: number) => void
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [value, setValue] = useState(0)

  const throttledMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget
      if (!card) return
      const box = card.getBoundingClientRect()
      const x = e.clientX - box.left
      const centerX = box.width / 2
      const rotateX = 0.25

      if ((x >= centerX && value < 100) || (x <= centerX && value > 0)) {
        const newValue = x >= centerX ? value + 1 : value - 1
        setValue(newValue)
        setRotate({ x: rotateX, y: x >= centerX ? 10 : -10 })
        onTiltElement?.(newValue)
      }
    },
    [value, onTiltElement]
  )

  const onMouseMove = useMemo(
    () => throttle(throttledMouseMove, 16),
    [throttledMouseMove]
  )

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
  }

  return (
    <StyledTilt
      data-testid="tilt-wrapper"
      rotate={rotate}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </StyledTilt>
  )
}
