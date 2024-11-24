import { act, fireEvent, render } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import Volume from "../components/Volume"
import "@testing-library/jest-dom"

describe("Randomize Volume", () => {
  it("should render the component Slider with a randomize button", () => {
    const { getByTestId } = render(<Volume ui="randomize" />)
    expect(getByTestId("slider-component")).toBeInTheDocument()
    expect(getByTestId("randomize-button")).toBeInTheDocument()
  })

  it("trigger a call when click button", () => {
    const { getByTestId } = render(<Volume ui="randomize" />)
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
  it("should render the component Slider with a randomize button", () => {
    const { getByTestId } = render(<Volume ui="clickToDeath" />)
    expect(getByTestId("slider-component")).toBeInTheDocument()
    expect(getByTestId("clickToDeath-button")).toBeInTheDocument()
  })

  it("trigger a call when click button or onMouseLeave", async () => {
    const { getByTestId } = render(<Volume ui="clickToDeath" />)

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

  it("should decrease value onMouseLeave", async () => {
    const { getByTestId } = render(<Volume ui="clickToDeath" />)
    const button = getByTestId("clickToDeath-button")

    expect(getByTestId("slider-value").textContent).toBe("0")

    act(() => {
      fireEvent.click(button)
    })

    expect(getByTestId("slider-value").textContent).toBe("1")

    act(() => {
      fireEvent.mouseLeave(button)
    })
    await new Promise((r) => setTimeout(r, 2000))

    expect(getByTestId("slider-value").textContent).toBe("0")
  })
})

describe("Tilt wrapped Volume", () => {
  it("should render the component Slider with a tilt wrapper", () => {
    const { getByTestId } = render(<Volume ui="tilt" />)
    expect(getByTestId("slider-component")).toBeInTheDocument()
    expect(getByTestId("tilt-wrapper")).toBeInTheDocument()
  })

  it("should inc when mouse on > width/2 and should dec when mouse on < width/2", async () => {
    const { getByTestId } = render(<Volume ui="tilt" />)

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
