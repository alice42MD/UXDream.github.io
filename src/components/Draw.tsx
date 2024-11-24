import { useEffect, useState } from "react"
import _ from "lodash"
import { StyledDraw } from "../styles/Volume"

const getpPercentageColoredPixel = (
  e: MouseEvent,
  myPics: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) => {
  const emptyImgSize = context.getImageData(
    e.offsetX,
    e.offsetY,
    myPics.width,
    myPics.height
  ).data.length
  const coloredImgSize = context
    .getImageData(0, 0, myPics.width, myPics.height)
    .data.filter((coloredPixel) => coloredPixel !== 0).length
  return _.floor((coloredImgSize * 100) / emptyImgSize)
}

export const Draw = () => {
  const [value, setValue] = useState<number>(0)
  // When true, moving the mouse draws on the canvas
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [coord, setCoord] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Add the event listeners for mousedown, mousemove, and mouseup
  useEffect(() => {
    const myPics = document.getElementById("myPics") as HTMLCanvasElement
    const context = myPics && myPics.getContext("2d")

    if (!myPics) return
    const mouseDownHandler = (e: MouseEvent) => {
      setCoord({ x: e.offsetX, y: e.offsetY })
      setIsDrawing(true)
    }

    const mouseMoveHandler = (e: MouseEvent) => {
      if (isDrawing && context) {
        drawLine(context, coord.x, coord.y, e.offsetX, e.offsetY)
        setCoord({ x: e.offsetX, y: e.offsetY })
        const newValue = getpPercentageColoredPixel(e, myPics, context)
        setValue(newValue)
      }
    }

    const mouseUpHandler = (e: MouseEvent) => {
      if (isDrawing && context) {
        drawLine(context, coord.x, coord.y, e.offsetX, e.offsetY)
        setCoord({ x: 0, y: 0 })
        setIsDrawing(false)
      }
    }

    myPics.addEventListener("mousedown", mouseDownHandler)
    myPics.addEventListener("mousemove", mouseMoveHandler)
    window.addEventListener("mouseup", mouseUpHandler)

    return () => {
      myPics.removeEventListener("mousedown", mouseDownHandler)
      myPics.removeEventListener("mousemove", mouseMoveHandler)
      window.removeEventListener("mouseup", mouseUpHandler)
    }
  }, [isDrawing, coord])

  const drawLine = (
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    context.beginPath()
    context.lineCap = "square"
    context.globalAlpha = 1
    context.strokeStyle = "#91caff"
    context.lineWidth = 2
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.stroke()
    context.closePath()
  }

  return (
    <StyledDraw className="parent">
      <canvas id="myPics" width="200" height="3"></canvas>
      <div>{value}</div>
    </StyledDraw>
  )
}
