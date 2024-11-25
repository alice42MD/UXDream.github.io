import { act, fireEvent, render } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import Volume from "../components/Volume"
import { createCanvas } from "canvas"
import "@testing-library/jest-dom"

describe("Randomize Volume", () => {
  it("Should render the component Slider with a randomize button && Should change value on click button", () => {
    const { getByTestId } = render(<Volume ui="randomize" />)

    expect(getByTestId("slider-component")).toBeInTheDocument()
    expect(getByTestId("randomize-button")).toBeInTheDocument()

    const handleClick = vi.fn()
    const button = getByTestId("randomize-button")
    button.onclick = handleClick // Assign the function directly

    act(() => {
      fireEvent.click(button)
    })

    expect(getByTestId("slider-value").textContent).not.toBe("0")
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

describe("ClickToDeath Volume", () => {
  it("Should render the component Slider with a clickToDeath button && Should inc value on click button and dec when onMouseLeave", async () => {
    const { getByTestId } = render(<Volume ui="clickToDeath" />)

    expect(getByTestId("slider-component")).toBeInTheDocument()
    expect(getByTestId("clickToDeath-button")).toBeInTheDocument()

    const button = getByTestId("clickToDeath-button")

    const handleClick = vi.fn()
    const handleMouseLeave = vi.fn()
    button.onclick = handleClick // Assign the function directly
    button.onmouseleave = handleMouseLeave

    expect(getByTestId("slider-value").textContent).toBe("0")

    act(() => {
      fireEvent.click(button)
    })

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(getByTestId("slider-value").textContent).toBe("1")

    act(() => {
      fireEvent.mouseLeave(button)
    })

    await new Promise((r) => setTimeout(r, 2000))

    expect(getByTestId("slider-value").textContent).toBe("0")
    expect(handleMouseLeave).toHaveBeenCalledTimes(1)
  })
})

describe("Tilt wrapped Volume", () => {
  it("Should render the component Slider with a tilt wrapper && Should inc when onMouseEntre > width/2, dec when onMouseEntre < width/2 and stop changing value when onMouseLeave", async () => {
    const { getByTestId } = render(<Volume ui="tilt" />)

    expect(getByTestId("slider-component")).toBeInTheDocument()
    expect(getByTestId("tilt-wrapper")).toBeInTheDocument()

    const tiltWrapper = getByTestId("tilt-wrapper")

    expect(getByTestId("slider-value").textContent).toBe("0")

    const handleMouseEnter = vi.fn()
    const handleMouseLeave = vi.fn()
    tiltWrapper.onmouseenter = handleMouseEnter
    tiltWrapper.onmouseleave = handleMouseLeave

    vi.spyOn(tiltWrapper, "getBoundingClientRect").mockReturnValue({
      width: 200,
      height: 10,
      top: 0,
      left: 0,
      right: 200,
      bottom: 10,
      x: 100,
      y: 5,
      toJSON: () => ({}),
    })

    act(() => {
      fireEvent.mouseEnter(tiltWrapper, {
        clientX: 101,
        clientY: 4,
      })
    })

    await new Promise((r) => setTimeout(r, 100))

    expect(handleMouseEnter).toHaveBeenCalledTimes(1)
    expect(getByTestId("slider-value").textContent).toBe("1")

    act(() => {
      fireEvent.mouseLeave(tiltWrapper)
    })

    expect(handleMouseLeave).toHaveBeenCalledTimes(1)
    expect(getByTestId("slider-value").textContent).toBe("1")

    act(() => {
      fireEvent.mouseEnter(tiltWrapper, {
        clientX: 99,
        clientY: 4,
      })
    })

    await new Promise((r) => setTimeout(r, 100))

    expect(handleMouseEnter).toHaveBeenCalledTimes(2)
    expect(getByTestId("slider-value").textContent).toBe("0")
  })
})

describe("Draw Volume", () => {
  // @ts-expect-error @ts-ignore
  global.HTMLCanvasElement.prototype.getContext = function (
    contextId: string,
    options?: CanvasRenderingContext2DSettings
  ): CanvasRenderingContext2D | null {
    if (contextId !== "2d") return null
    const canvas = createCanvas(200, 4)
    return canvas.getContext(
      contextId,
      options
    ) as unknown as CanvasRenderingContext2D | null
  }

  it("Should render the component Draw && Should update value when draw on canvas", async () => {
    const { getByTestId } = render(<Volume ui="draw" />)

    const myPics = getByTestId("canvas-elem") as HTMLCanvasElement
    expect(myPics).toBeInTheDocument()
    const context = myPics.getContext("2d")
    expect(context).not.toBeNull()

    act(() => {
      fireEvent.mouseDown(myPics, { clientX: 1, clientY: 2 })
    })

    act(() => {
      fireEvent.mouseMove(myPics, { clientX: 2, clientY: 2 })
      fireEvent.mouseMove(myPics, { clientX: 3, clientY: 2 })
    })
    act(() => {
      fireEvent.mouseUp(myPics, { clientX: 3, clientY: 2 })
    })

    const value = getByTestId("canvas-elem-value").textContent
    expect(value).toBe("1")
  })
})
