# TapTrust Design Guidelines
**Premium Luxury Brand Identity - Black & Gold Aesthetic**

## Brand Positioning
TapTrust è posizionato come un **brand di lusso esclusivo** che trasforma la reputazione in un asset tangibile. Il design comunica:
- **Esclusività**: Solo per chi merita eccellenza
- **Potere**: La fiducia come valuta premium
- **Prestigio**: Status symbol del business moderno
- **Autenticità**: Valore reale e misurabile

## Color Palette

### Primary Colors
- **Coal Black**: `#0a0a0a` - Sfondo principale, eleganza assoluta
- **Pure Gold**: `#CC9900` - Accenti premium, CTA, highlights
- **Rich Gold**: `#d4af37` - Gradients, hover states
- **Deep Gold**: `#b8860b` - Shadows, depth in gold elements

### Secondary Colors
- **Pearl White**: `#f5f4f2` - Backgrounds alternativi, contrasto soft
- **Charcoal**: `#1a1a1a` - Cards, elevated surfaces
- **Warm Gray**: `#2a2a2a` - Borders, dividers
- **Muted Gold**: `#e6c77f` - Text accents, subtle highlights

### Text Colors
- **Primary Text**: `#ffffff` - Headings, body text su dark
- **Secondary Text**: `#a0a0a0` - Descriptions, captions
- **Gold Text**: `#CC9900` - Emphasized words, brand moments
- **Inverse Text**: `#0a0a0a` - Text su background chiari

## Typography

### Font Families
- **Primary**: `"Inter", -apple-system, system-ui, sans-serif`
- **Display**: Bold weights (700-900) per headings
- **Body**: Regular/Medium weights (400-500) per text

### Type Scale
- **Hero Display**: `text-6xl md:text-7xl` (60-72px) - Ultra bold
- **Section Headings**: `text-4xl md:text-5xl` (36-48px) - Bold
- **Subsection Headings**: `text-2xl md:text-3xl` (24-30px) - Semibold
- **Card Titles**: `text-xl` (20px) - Bold
- **Body Large**: `text-lg` (18px) - Regular/Medium
- **Body**: `text-base` (16px) - Regular
- **Small**: `text-sm` (14px) - Regular

### Typography Rules
- **Line Height**: Generous spacing (1.4-1.6) per leggibilità
- **Letter Spacing**: Tight per headings (`tracking-tight`), normale per body
- **Text Hierarchy**: Usare gold accents per enfatizzare parole chiave
- **Contrast**: Alto contrasto bianco su nero per maximum impact

## Layout & Spacing

### Container Widths
- **Max Width**: `max-w-7xl` (1280px) per sezioni full
- **Content Width**: `max-w-4xl` (896px) per testo centrato
- **Hero Width**: `max-w-6xl` (1152px) per hero sections

### Spacing System
- **Section Padding**: `py-16 md:py-24` (64-96px verticale)
- **Card Padding**: `p-8 md:p-12` (32-48px)
- **Element Gap**: `gap-8 md:gap-12` tra cards/elementi
- **Text Spacing**: `space-y-6` per paragrafi

### Grid Layouts
- **3 Columns**: `grid-cols-1 md:grid-cols-3` per features
- **2 Columns**: `grid-cols-1 md:grid-cols-2` per comparisons
- **Responsive**: Mobile-first, collassa a singola colonna

## Components

### Buttons

#### Primary CTA (Gold)
```css
className="bg-gold hover:bg-gold/90 text-coal font-bold text-lg px-8 py-4 rounded-lg transition-all hover:scale-105 shadow-lg"
```

#### Secondary CTA (Outline Gold)
```css
className="border-2 border-gold text-gold hover:bg-gold hover:text-coal font-semibold text-lg px-8 py-4 rounded-lg transition-all"
```

#### Ghost Button
```css
className="text-white hover:text-gold font-medium text-lg px-6 py-3 transition-colors"
```

### Cards

#### Premium Card
```css
className="bg-charcoal border border-warm-gray/20 rounded-2xl p-8 hover:border-gold/40 transition-all hover:shadow-xl hover:shadow-gold/10"
```

#### Elevated Card
```css
className="bg-gradient-to-br from-charcoal to-coal border border-gold/20 rounded-2xl p-12 shadow-2xl"
```

#### Stats Card
```css
className="text-center p-6 border-l-4 border-l-gold bg-charcoal/50"
```

### Sections

#### Hero Section
- Background: `bg-coal` con possibile gradient subtile
- Full viewport height o `min-h-[600px]`
- Centered content con strong CTA hierarchy
- Optional: Subtle pattern/texture overlay

#### Feature Section
- Alternating backgrounds: `bg-coal` e `bg-charcoal`
- Generous padding: `py-16 md:py-24`
- Grid layout per features
- Icons/emojis dorati per visual interest

#### CTA Section
- Gradient background: `bg-gradient-to-br from-coal via-charcoal to-coal`
- Centered, impactful messaging
- Strong gold accents
- Multiple button options

## Visual Elements

### Icons & Emojis
- **Gold Accents**: Usa `text-gold` per emoji/icons
- **Large Size**: `text-4xl md:text-5xl` per section icons
- **Spacing**: Generoso margin bottom `mb-6`

### Badges & Tags
- **Gold Badge**: Rounded, `bg-gold text-coal px-4 py-2 font-bold`
- **Outline Badge**: `border border-gold text-gold px-4 py-2`

### Dividers
- **Subtle**: `border-t border-warm-gray/20`
- **Gold Accent**: `border-t-2 border-gold/40`

### Shadows
- **Card Hover**: `hover:shadow-2xl hover:shadow-gold/10`
- **Elevated**: `shadow-xl shadow-black/50`

## Interactions & Animations

### Hover States
- **Buttons**: Scale `hover:scale-105`, subtle glow
- **Cards**: Border color shift, shadow expansion
- **Links**: Color transition to gold

### Transitions
- **Duration**: `transition-all duration-300`
- **Easing**: Default ease-in-out
- **Properties**: transform, colors, shadows

### Focus States
- **Visible**: Gold ring `focus:ring-2 focus:ring-gold`
- **Offset**: `focus:ring-offset-2 focus:ring-offset-coal`

## Content Tone & Voice

### Messaging Guidelines
- **Aspirational**: Parla al desiderio di eccellenza
- **Esclusivo**: "Solo per chi...", "Riservato a...", "Elite"
- **Potente**: "Domina", "Conquista", "Trasforma"
- **Tangibile**: Numeri concreti, risultati misurabili
- **Urgente**: "Non aspettare", "Oggi stesso", "Ora"

### Text Patterns
- **Headlines**: Brevi, impattanti, gold accents su keyword
- **Subheadings**: Espandono il concetto, creano desiderio
- **Body**: Chiaro, benefit-focused, credibile
- **CTAs**: Action-oriented, FOMO-inducing

### Examples
✅ "Ogni Voce Lascia il Segno"
✅ "La Fiducia Non Si Chiede. Si Conquista."
✅ "TapTrust Elite: Un invito. Un privilegio."
✅ "La Tua Reputazione Non Aspetta"

## Responsive Design

### Breakpoints
- **Mobile**: `< 768px` - Singola colonna, stack verticale
- **Tablet**: `768px - 1024px` - 2 colonne dove appropriato
- **Desktop**: `> 1024px` - Full layout, 3+ colonne

### Mobile Optimizations
- **Text Size**: Ridurre di 1-2 step su mobile
- **Padding**: Ridurre a `py-12 px-4` su mobile
- **Buttons**: Full width su mobile quando appropriato
- **Cards**: Stack verticalmente

## Special Elements

### Number/Stats Display
- **Large Number**: `text-5xl font-bold text-gold`
- **Label**: `text-sm uppercase tracking-wide text-gray-400`
- **Layout**: Centered, card-based

### Testimonials/Social Proof
- **Quote**: Italic, `text-xl text-white`
- **Author**: `text-gold font-semibold`
- **Background**: Subtle charcoal card

### Pricing Cards
- **Elite**: Extra padding, gold border, gradient background
- **Business**: Standard card, highlight value
- **Compare**: Side-by-side grid, clear differentiation

## Accessibility

### Contrast Ratios
- White on Black: ✅ AAA (21:1)
- Gold (#CC9900) on Black: ✅ AA (8.4:1)
- Gold on White: ⚠️ Use darker gold (#b8860b)

### Interactive Elements
- Minimum touch target: 44x44px
- Clear focus indicators
- Semantic HTML structure

### Content
- Descriptive alt text per images
- Proper heading hierarchy (h1 → h2 → h3)
- Skip links dove appropriato

## Brand Assets

### Logo Usage
- **Primary**: Gold "TapTrust" wordmark
- **Icon**: Gold gradient circle/badge
- **Spacing**: Generous whitespace intorno al logo

### Imagery Guidelines
- **Style**: Premium, luxury, professional photography
- **Subjects**: Cards in hand, elegant settings, premium materials
- **Treatment**: Subtle desaturation, gold overlay/tint
- **Fallback**: Elegant geometric patterns se no images

## Do's and Don'ts

### ✅ Do:
- Use generous white space
- Emphasize luxury and exclusivity
- Create clear visual hierarchy
- Use gold sparingly for maximum impact
- Write aspirational, powerful copy
- Show tangible results and data

### ❌ Don't:
- Overcrowd layouts
- Use cheap stock photos
- Mix too many colors
- Dilute the premium positioning
- Use generic corporate language
- Hide pricing or create confusion
