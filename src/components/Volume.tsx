import { useState } from "react"
import _ from "lodash"
import { Button, Slider } from "antd"
import { StyledSlider } from "../styles/Volume"

export interface SliderComponentProps {
  value: number
}

const SliderComponent = ({ value }: SliderComponentProps) => (
  <StyledSlider>
    <Slider value={value} />
    <div>{value}</div>
  </StyledSlider>
)

export interface VolumeProps {
  ui: "randomize"
}

const Volume = ({ ui }: VolumeProps) => {
  const [state, setState] = useState({
    value: 0,
    isDecreasing: false,
  })

  const setValue = (value: number) => setState((prev) => ({ ...prev, value }))
  const onClickRandomizeButton = () => setValue(_.random(0, 100, false))

  return (
    <>
      <SliderComponent value={state.value} />
      {ui === "randomize" && (
        <Button onClick={onClickRandomizeButton}>Click</Button>
      )}
    </>
  )
}

export default Volume
