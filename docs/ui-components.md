# UI Components and Styling

Technologies:

- Tailwind CSS 4 for utility-first styling
- shadcn/ui patterns with class-variance-authority (CVA)
- Radix primitives for a11y; Lucide for icons

Conventions:

- Shared primitives live in `src/components/ui/*`
- Feature components live under `src/components/dashboard/*` and `src/components/landing-page/*`
- Prefer CVA variants for size/intent; avoid ad-hoc class concatenation in call sites

Example: `src/components/ui/button.tsx`

```ts
const buttonVariants = cva('base-classes', { variants: { variant: { default: '...', destructive: '...' }, size: { sm: '...', lg: '...' } }, defaultVariants: { variant: 'default', size: 'default' } })
function Button({ variant, size, asChild, ...props }: Props) { const Comp = asChild ? Slot : 'button'; return <Comp className={cn(buttonVariants({ variant, size }))} {...props} /> }
```

Tips:

- Keep primitives unopinionated; layer feature styling at the call site
- Co-locate complex feature components with their feature directories
- Use `cn()` utility from `src/lib/utils` to merge classes safely
