# SouLVE Official Brand Colors

## Primary Brand Colors

These are the ONLY colors that should be used for brand elements, gradients, and primary UI components.

### Color 1: Teal/Turquoise
- **Hex**: `#0ce4af`
- **RGB**: `12, 228, 175`
- **CMYK**: `62, 0, 47, 0`
- **Usage**: Primary brand color, gradients (start), buttons, highlights

### Color 2: Blue
- **Hex**: `#18a5fe`
- **RGB**: `24, 165, 254`
- **CMYK**: `66, 25, 0, 0`
- **Usage**: Secondary brand color, gradients (end), accents

### Color 3: Purple (Accent Only)
- **Hex**: `#4c3dfb`
- **RGB**: `76, 61, 251`
- **CMYK**: `78, 73, 0, 0`
- **Usage**: Accent color ONLY - use sparingly for special highlights, not in primary gradients

## Typography
- **Font**: Poppins

## Gradient Usage

### ✅ CORRECT Brand Gradient
```css
background: linear-gradient(to right, #0ce4af, #18a5fe);
/* Teal to Blue */
```

### ❌ INCORRECT - Do Not Use
```css
background: linear-gradient(to right, #0ce4af, #18a5fe, #4c3dfb);
/* Do not add purple to primary gradients */
```

## Tailwind CSS Classes

### Using Brand Colors in Tailwind

For exact brand colors, use bracket notation:
```tsx
className="bg-[#0ce4af]"           // Teal background
className="text-[#18a5fe]"         // Blue text
className="from-[#0ce4af] to-[#18a5fe]"  // Brand gradient
```

### Approximate Tailwind Colors
- Teal: `teal-400`, `teal-500`, `teal-600`
- Blue: `blue-500`, `sky-500`

**Note**: For brand-critical elements (headers, logos, primary buttons), always use the exact hex values with bracket notation.

## CSS Custom Properties

Consider adding these to your global CSS:

```css
:root {
  --soulve-teal: #0ce4af;
  --soulve-blue: #18a5fe;
  --soulve-purple: #4c3dfb; /* Accent only */
}
```

## Component Examples

### Header Gradient
```tsx
<div className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe]">
```

### Button
```tsx
<button className="bg-[#0ce4af] hover:bg-[#18a5fe]">
```

### Text Accent
```tsx
<h1 className="text-[#0ce4af]">
```

## Important Notes

1. **Primary gradients should ONLY use teal → blue**
2. **Purple is an accent color** - use sparingly for special elements
3. **Maintain consistency** across all pages and components
4. **Reference this document** before making color changes

## Source
Brand colors from: `C:\Users\kevin\CascadeProjects\Soulve\Soulve logo and brand colours pack\Soulve Logo Pack\Font & Color\font-&-color.jpg`
