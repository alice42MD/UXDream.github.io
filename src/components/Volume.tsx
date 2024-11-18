import "../styles/volume.css"

export interface VolumeProps {
  /** How large should the ranger be? */
  size?: "small" | "medium" | "large"
  /** Ranger contents */
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
