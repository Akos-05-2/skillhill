"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, children, ...props }, ref) => (
  <label
    ref={ref}
    className={className}
    {...props}
  >
    {children}
  </label>
))
Label.displayName = "Label"

export { Label } 