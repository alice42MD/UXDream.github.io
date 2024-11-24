import type { Meta, StoryObj } from "@storybook/react"
// import { fn } from "@storybook/test"

import Volume from "../components/Volume"

const meta = {
  title: "Example/Volume",
  component: Volume,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  // args: { onChange: fn() },
} satisfies Meta<typeof Volume>

export default meta
type Story = StoryObj<typeof meta>

export const Randomize: Story = {
  args: {
    ui: "randomize",
  },
}
