"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/* ================= ROOT ================= */

function Select(
  props: React.ComponentProps<typeof SelectPrimitive.Root>
) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup(
  props: React.ComponentProps<typeof SelectPrimitive.Group>
) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue(
  props: React.ComponentProps<typeof SelectPrimitive.Value>
) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

/* ================= TRIGGER ================= */

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        `
        flex items-center justify-between gap-2
        rounded-md border border-gray-300
        bg-white px-3 py-2 text-sm
        transition-colors outline-none shadow-sm

        hover:bg-[var(--brand-400)]
        hover:text-white

        data-[state=open]:bg-[var(--brand-400)]
        data-[state=open]:text-white

        focus:ring-2 focus:ring-[var(--brand-400)]
        focus:border-[var(--brand-400)]

        disabled:cursor-not-allowed disabled:opacity-50
        data-[size=default]:h-9 data-[size=sm]:h-8
        `,
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-80" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

/* ================= CONTENT ================= */

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        align={align}
        className={cn(
          `
          z-50 min-w-[8rem]
          rounded-md border border-gray-200
          bg-white shadow-md
          overflow-hidden
          `,
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

/* ================= LABEL ================= */

function SelectLabel(
  props: React.ComponentProps<typeof SelectPrimitive.Label>
) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className="px-2 py-1.5 text-xs text-gray-500"
      {...props}
    />
  )
}

/* ================= ITEM (IMPORTANT PART) ================= */

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        `
        relative flex w-full cursor-pointer select-none
        items-center rounded-sm py-1.5 pl-2 pr-8 text-sm
        text-gray-700 transition-colors outline-none

        /* HOVER */
        data-[highlighted]:bg-[var(--brand-400)]
        data-[highlighted]:text-white

        /* SELECTED */
        data-[state=checked]:bg-[var(--brand-400)]
        data-[state=checked]:text-white

        data-[disabled]:pointer-events-none
        data-[disabled]:opacity-50
        `,
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-white" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

/* ================= SEPARATOR ================= */

function SelectSeparator(
  props: React.ComponentProps<typeof SelectPrimitive.Separator>
) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className="my-1 h-px bg-gray-200"
      {...props}
    />
  )
}

/* ================= SCROLL BUTTONS ================= */

function SelectScrollUpButton(
  props: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>
) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className="flex items-center justify-center py-1"
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton(
  props: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>
) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className="flex items-center justify-center py-1"
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

/* ================= EXPORTS ================= */

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
