# Design System Strategy: The Tactile Sanctuary

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Hanok."** 

We are moving away from the cold, clinical nature of modern SaaS and toward a "healing" atmosphere that evokes the sensory experience of a high-end Korean wellness retreat. By blending the airy fluidity of salt-water hues with the grounded stability of warm timber, we create a space that feels curated, not coded. 

To break the "template" look, this system rejects the rigid 12-column grid in favor of **intentional asymmetry and editorial breathing room.** We utilize overlapping elements—such as cards that subtly break the container of a section—to create a sense of physical arrangement. The goal is to make every screen feel like a thoughtfully composed page from a premium lifestyle journal rather than a digital interface.

---

## 2. Colors: Tonal Atmosphere
The palette is a dialogue between the cool `secondary-fixed` (Salt Blue) and the grounding `primary` (Warm Wood). 

*   **Primary (`#B3AC9F`):** Reserved for moments of authority and primary actions. It represents the depth of aged wood.
*   **Secondary (`#D4E6F1`):** Used for navigation and structural grounding.
*   **Tertiary (`#F8F5F2`):** A sophisticated neutral for secondary information.
*   **Neutral (`#333333`):** The base neutral color.
*   **Surface Tiers:** Our primary tool for hierarchy.

### The "No-Line" Rule
Standard UI relies on lines to separate ideas. This design system prohibits the use of 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. A `surface-container-low` section sitting on a `surface` background provides enough distinction to the eye without cluttering the visual field.

### Surface Hierarchy & Nesting
Treat the UI as physical layers.
*   **Base:** `surface` (#FBF9F8)
*   **Floating Elements:** `surface-container-lowest` (#FFFFFF) for the most prominent cards.
*   **Sunken Elements:** `surface-container-high` (#E9E8E8) for secondary utility areas.
*   **The Glass Rule:** For floating navigation or modal overlays, use semi-transparent `secondary-fixed-dim` with a `backdrop-blur` (20px-40px). This "Glassmorphism" allows the salt-blue tones to bleed through, softening the interface.

---

## 3. Typography: Editorial Authority
We utilize **Manrope** (a sophisticated alternative to Pretendard) to achieve a clean, humanist feel that retains high legibility.

*   **Display & Headlines:** Use `display-lg` to `headline-sm` with tight letter-spacing (-0.02em). These should act as the "anchor" for each page, often placed with asymmetrical padding to create an editorial look.
*   **Titles:** `title-lg` is your primary structural header. It should feel authoritative but welcoming.
*   **Body:** `body-lg` is optimized for long-form reading. We prioritize line height (1.6) to ensure the "healing" atmosphere extends to the reading experience.
*   **Labels:** `label-md` is used for metadata, always in `on-surface-variant` to maintain a soft hierarchy.

---

## 4. Elevation & Depth
In this design system, depth is a result of **Tonal Layering**, not artificial lighting.

*   **The Layering Principle:** Instead of a shadow, place a `surface-container-lowest` card (#FFFFFF) on a `surface-container-low` background. The subtle shift in hex value creates a "soft lift."
*   **Ambient Shadows:** If a floating action requires a shadow (e.g., a FAB or a temporary Popover), use an ultra-diffused shadow: `box-shadow: 0 20px 40px rgba(81, 97, 107, 0.06)`. Note the use of the `secondary` color in the shadow to keep it "organic" and avoid muddy greys.
*   **The Ghost Border:** For accessibility in input fields, use a "Ghost Border"—the `outline-variant` token at 20% opacity. It should feel like a suggestion of a boundary, not a cage.

---

## 5. Components

### Buttons
*   **Primary:** `primary` background with `on-primary` text. Use the `full` (maximum, pill-shaped) corner radius to make it feel like a polished river stone.
*   **Secondary:** `primary-container` background. Low contrast, high tactile feel.
*   **Tertiary:** Ghost style. No background, `on-surface` text with a 2px underline in `surface-tint` at 30% opacity.

### Input Fields
*   **Style:** `surface-container-lowest` background with a `sm` (0.5rem) corner radius. 
*   **State:** On focus, the background transitions to `secondary-container`, and the ghost border strengthens slightly. No harsh outlines.

### Cards & Lists
*   **Rule:** **Forbid all divider lines.** 
*   **Separation:** Use the Spacing Scale (compact, 16px) to separate list items. For complex data, use alternating tonal backgrounds (`surface` to `surface-container-low`) rather than horizontal rules.

### Tactile Chips
*   Small, `full` rounded pill shapes. Use `tertiary-fixed` for unselected states and `primary` for selected states. They should feel like small wooden or ceramic tokens.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace White Space:** Give elements a compact level of spacing. Space is a luxury; use it.
*   **Asymmetric Layouts:** Place a headline on the left and the body text starting from the center of the screen to create a sophisticated, high-end editorial feel.
*   **Subtle Gradients:** Use a very soft linear gradient from `primary-container` to `surface` for large hero sections to add "soul."

### Don’t:
*   **Don't use pure black:** Never use #000000. Always use `on-surface` (#313333) for text to keep the "soft-touch" feel.
*   **Don't use default shadows:** Standard 0/4/4 shadows will break the organic atmosphere. Stick to tonal layering.
*   **Don't crowd the corners:** Even with maximum (`full`) corners, ensure the internal padding is generous enough that the content doesn't feel "squeezed" by the curve.