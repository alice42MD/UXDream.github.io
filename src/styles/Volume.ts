import styled from 'styled-components'

/* //slider */
export const StyledSlider = styled.div`
  width: 200px;
`

/* //button */
export const StyledButton = styled.div`
`

/* //button */
type StyledTiltProps = {
  rotate: {x: number, y:number}
}
export const StyledTilt = styled.div<StyledTiltProps>`
  width: 200px;
  transform: ${({ rotate }) => `rotate(${rotate.x}deg) rotate(${rotate.y}deg)`};
  transition: transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s;
  `