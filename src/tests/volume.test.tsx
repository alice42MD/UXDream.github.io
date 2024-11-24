import { describe, it, expect, vi } from "vitest"
import Volume from "../components/Volume"
import { act, fireEvent, render } from "@testing-library/react"
import "@testing-library/jest-dom"

describe(" Randomize Volume", () => {
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
