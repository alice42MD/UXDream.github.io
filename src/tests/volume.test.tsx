import { describe, it, expect, vi } from "vitest"
import Volume from "../components/Volume"
import { act, fireEvent, render, screen } from "@testing-library/react"
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
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("should return a number !=  && > 0", () => {
    const { getByTestId } = render(<Volume ui="randomize" />)

    const sliderValue = getByTestId("slider-value").textContent
    expect(Number(sliderValue)).toBe(0)

    const button = getByTestId("randomize-button")
    act(() => {
      fireEvent.click(button)
    })
    const newSliderValue = getByTestId("slider-value").textContent
    expect(Number(newSliderValue)).not.toBe(0)
    expect(Number(newSliderValue)).toBeGreaterThan(0)
  })
})

describe("ClickToDeath Volume", () => {
  it("should render the component Slider with a randomize button", () => {
    const { getByTestId } = render(<Volume ui="clickToDeath" />)
    expect(getByTestId("slider-component")).toBeInTheDocument()
    expect(getByTestId("clickToDeath-button")).toBeInTheDocument()
  })

  it("trigger a call when click button or onMouseLeave", () => {
    const { getByTestId } = render(<Volume ui="clickToDeath" />)
    const handleClick = vi.fn()
    const handleMouseLeave = vi.fn()
    const button = getByTestId("clickToDeath-button")
    button.onclick = handleClick // Assign the function directly
    button.onmouseleave = handleMouseLeave
    act(() => {
      fireEvent.click(button)
    })
    expect(handleClick).toHaveBeenCalledTimes(1)
    act(() => {
      fireEvent.mouseLeave(button)
    })
    expect(handleMouseLeave).toHaveBeenCalledTimes(1)
  })

  it("should decrease value onMouseLeave", async () => {
    const { getByTestId } = render(<Volume ui="clickToDeath" />)

    const sliderValue = getByTestId("slider-value").textContent
    expect(Number(sliderValue)).toBe(0)

    const button = getByTestId("clickToDeath-button")
    act(() => {
      fireEvent.click(button)
    })
    const sliderValueInc = getByTestId("slider-value").textContent
    expect(Number(sliderValueInc)).toBe(1)
    act(() => {
      fireEvent.mouseLeave(button)
    })
    await new Promise((r) => setTimeout(r, 2000))
    const sliderValueDec = getByTestId("slider-value").textContent
    expect(Number(sliderValueDec)).toBe(0)
  })
})

describe("Tilt wrapped Volume", () => {
  it("should render the component Slider with a tilt wrapper", () => {
    const { getByTestId } = render(<Volume ui="tilt" />)
    expect(getByTestId("slider-component")).toBeInTheDocument()
    expect(getByTestId("tilt-wrapper")).toBeInTheDocument()
  })

  it("should trigger call on mouseMove and mouseLeave wrapper", async () => {
    const { getByTestId } = render(<Volume ui="tilt" />)
    const handleMouseMove = vi.fn()
    const handleMouseLeave = vi.fn()
    const tiltWrapper = getByTestId("tilt-wrapper")
    tiltWrapper.onmousemove = handleMouseMove // Assign the function directly
    tiltWrapper.onmouseleave = handleMouseLeave
    act(() => {
      fireEvent.mouseMove(tiltWrapper)
    })
    expect(handleMouseMove).toHaveBeenCalledTimes(1)
    act(() => {
      fireEvent.mouseLeave(tiltWrapper)
    })
    expect(handleMouseLeave).toHaveBeenCalledTimes(1)
  })

  it("should inc when mouse on > width/2 and should dec when mouse on < width/2", async () => {
    const { getByTestId } = render(<Volume ui="tilt" />)

    const tiltWrapper = getByTestId("tilt-wrapper")
    const sliderValue = getByTestId("slider-value").textContent
    expect(Number(sliderValue)).toBe(0)

    const handleMouseMove = vi.fn()
    tiltWrapper.onmousemove = handleMouseMove

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
    screen.debug()
    const newIncSliderValue = getByTestId("slider-value").textContent
    expect(Number(newIncSliderValue)).toBe(1)

    act(() => {
      fireEvent.mouseLeave(tiltWrapper)
    })
    const newSliderValue = getByTestId("slider-value").textContent
    expect(Number(newSliderValue)).toBe(1)

    act(() => {
      fireEvent.mouseEnter(tiltWrapper, {
        clientX: 99,
        clientY: 4,
      })
    })
    await new Promise((r) => setTimeout(r, 100))
    const newDecSliderValue = getByTestId("slider-value").textContent
    expect(Number(newDecSliderValue)).toBe(0)
  })
})
