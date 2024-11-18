import "../styles/volume.css"

export interface VolumeProps {
  /** How large should the button be? */
  size?: "small" | "medium" | "large"
  /** Button contents */
  label: string
  /** Optional click handler */
  onClick?: () => void
}

/** Primary UI component for user interaction */
export const Volume = ({ size = "medium", label, ...props }: VolumeProps) => {
  return (
    <div className={`storybook-volume--${size}`} {...props}>
      VOLUME !
    </div>
  )
}
