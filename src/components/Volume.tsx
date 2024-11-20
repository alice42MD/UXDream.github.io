import { useState } from "react"
import { Slider } from "antd"
import "../styles/volume.css"

export interface VolumeProps {
  /** How large should the slider be? */
  size?: "small" | "medium" | "large"
  /** slider contents */
  label?: string
  /** Optional change value handler */
  onChange?: () => void
}

/** Primary UI component for user interaction */
export const Volume = ({ size = "medium", label, ...props }: VolumeProps) => {
  const [value, setValue] = useState<number>(0)

  return (
    <>
      <Slider
        style={{ width: "200px" }}
        onChange={(newValue) => setValue(newValue)}
        range={false}
        value={value}
        defaultValue={0}
        className={`storybook-volume--${size}--tilt`}
        {...props}
      />
      {value}
    </>
  )
}
