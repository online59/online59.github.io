import type { SVGProps } from "react"

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 3H14C16.2091 3 18 4.79086 18 7V17C18 19.2091 16.2091 21 14 21H6V3Z" fill="currentColor" />
      <path d="M6 3V12H12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4H6V3Z" fill="hsl(var(--background))" />
    </svg>
  )
}
