import { useEffect, useState } from "react"
import _ from "lodash"
import { Button, Slider } from "antd"
import TiltEffect from "./TiltElement"
import Draw from "./Draw"
import OpenMic from "./OpenMic"
import { StyledSlider } from "../styles/styleVolume"

export interface SliderComponentProps {
  value: number
}

export const SliderComponent = ({ value }: SliderComponentProps) => (
  <StyledSlider data-testid="slider-component">
    <Slider value={value} />
    <div data-testid="slider-value">{value}</div>
  </StyledSlider>
)

export interface VolumeProps {
  ui: "randomize" | "clickToDeath" | "tilt" | "draw" | "scream"
}

const Volume = ({ ui }: VolumeProps) => {
  const [state, setState] = useState({
    value: 0,
    isDecreasing: false,
  })

  const setValue = (value: number) => setState((prev) => ({ ...prev, value }))
  const setDecrease = (isDecreasing: boolean) =>
    setState((prev) => ({ ...prev, isDecreasing }))

  const onClickRandomizeButton = () => setValue(_.random(1, 100, false))

  const onClickToDeath = () => {
    setDecrease(false)
    if (state.value < 100) setValue(state.value + 1)
  }
  const onMouseLeave = () => {
    if (state.value === 0) return setDecrease(false)
    setDecrease(true)
  }

  useEffect(() => {
    if (ui === "clickToDeath" && state.isDecreasing) {
      const interval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          value: Math.max(prev.value - 1, 0),
        }))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [state.isDecreasing, ui])

  const renderContent = () => {
    if (ui === "tilt") return <TiltEffect />
    if (ui === "draw") return <Draw />
    if (ui === "scream")
      return (
        <>
          <OpenMic onChange={(newValue: number) => setValue(newValue)}>
            <SliderComponent value={state.value} />
          </OpenMic>
        </>
      )
    return (
      <>
        <SliderComponent value={state.value} />
        {ui === "randomize" && (
          <Button
            data-testid="randomize-button"
            onClick={onClickRandomizeButton}
          >
            Click
          </Button>
        )}
        {ui === "clickToDeath" && (
          <Button
            data-testid="clickToDeath-button"
            onMouseLeave={onMouseLeave}
            onClick={onClickToDeath}
          >
            Click
          </Button>
        )}
      </>
    )
  }

  return <>{renderContent()}</>
}

export default Volume
