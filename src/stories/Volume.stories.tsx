import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"

import { Volume } from "../components/Volume"

const meta = {
  title: "Example/Volume",
  component: Volume,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: fn() },
} satisfies Meta<typeof Volume>

export default meta
type Story = StoryObj<typeof meta>

export const Large: Story = {
  args: {
    size: "large",
    label: "Volume",
  },
}

export const Medium: Story = {
  args: {
    size: "medium",
    label: "Volume",
  },
}

export const Small: Story = {
  args: {
    size: "small",
    label: "Volume",
  },
}
