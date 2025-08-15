# Color Palette Usage Guide

This guide explains how to use the new color palette from coolors.co in the logistics-app.

## Color Palette Overview

The color palette consists of 5 colors:

| Color Name | Hex Code | Usage |
|------------|----------|--------|
| Dark Blue | `#2B2D42` | Primary text, headers, navigation |
| Cool Gray | `#8D99AE` | Secondary text, borders, muted elements |
| Light Gray | `#EDF2F4` | Background, cards, content areas |
| Primary Red | `#EF233C` | Primary actions, alerts, highlights |
| Dark Red | `#D90429` | Hover states, danger actions, emphasis |

## Usage Examples

### Tailwind CSS Classes

```jsx
// Background colors
<div className="bg-dark-blue">Dark Blue Background</div>
<div className="bg-cool-gray">Cool Gray Background</div>
<div className="bg-light-gray">Light Gray Background</div>
<div className="bg-primary-red">Primary Red Background</div>
<div className="bg-dark-red">Dark Red Background</div>

// Text colors
<h1 className="text-dark-blue">Dark Blue Text</h1>
<p className="text-cool-gray">Cool Gray Text</p>
<span className="text-primary-red">Red Text</span>

// Border colors
<div className="border border-cool-gray">Border Example</div>
<button className="border border-primary-red">Red Border Button</button>
```

### CSS Variables

```css
/* In your CSS files */
.my-component {
  background-color: var(--light-gray);
  color: var(--dark-blue);
  border: 1px solid var(--cool-gray);
}

.my-button {
  background-color: var(--primary-red);
  color: var(--light-gray);
}

.my-button:hover {
  background-color: var(--dark-red);
}
```

### React Component Example

```jsx
import React from 'react';

const MyComponent = () => {
  return (
    <div className="bg-light-gray p-4 rounded-lg">
      <h2 className="text-dark-blue text-xl font-bold mb-2">
        Component Title
      </h2>
      <p className="text-cool-gray mb-4">
        This is some secondary text.
      </p>
      <button className="bg-primary-red text-light-gray px-4 py-2 rounded hover:bg-dark-red transition-colors">
        Action Button
      </button>
    </div>
  );
};
```

## Best Practices

1. **Consistency**: Use the defined color names consistently throughout the application
2. **Accessibility**: Ensure sufficient contrast ratios (WCAG 2.1 AA standards)
3. **Hover States**: Use darker shades for hover effects
4. **Focus States**: Use the primary red for focus indicators
5. **Error States**: Use dark red for error messages and destructive actions

## Component Examples

### Buttons
```jsx
// Primary button
<button className="bg-primary-red text-light-gray px-4 py-2 rounded hover:bg-dark-red transition-colors">
  Primary Action
</button>

// Secondary button
<button className="bg-cool-gray text-light-gray px-4 py-2 rounded hover:bg-dark-blue transition-colors">
  Secondary Action
</button>

// Outline button
<button className="border border-primary-red text-primary-red px-4 py-2 rounded hover:bg-primary-red hover:text-light-gray transition-colors">
  Outline Button
</button>
```

### Cards
```jsx
<div className="bg-light-gray border border-cool-gray rounded-lg p-6">
  <h3 className="text-dark-blue text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-cool-gray">Card content goes here</p>
</div>
```

### Forms
```jsx
<input 
  className="border border-cool-gray rounded px-3 py-2 focus:border-primary-red focus:outline-none"
  placeholder="Enter text..."
/>
```

## Testing the Colors

To see all colors in action, you can import and use the `ColorPaletteDemo` component:

```jsx
import ColorPaletteDemo from './components/ColorPaletteDemo';

// In your component
<ColorPaletteDemo />
```

## Migration Tips

1. Replace existing color values with the new palette
2. Update button styles to use the new color classes
3. Ensure all text has proper contrast with backgrounds
4. Test hover and focus states
5. Update any inline styles to use Tailwind classes or CSS variables
