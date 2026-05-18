# Billboard Card UI & Development Audit

This document tracks all the specific UI requirements, code adjustments, and "Elite" features we worked on for the Billboard Catalog cards throughout our development history.

## 1. Typography & Branding
- **Font Family (Primary)**: `Antonio` (Ultra-Condensed, Bold). Used for main titles and card headers to create a high-fashion, high-impact corporate look.
- **Font Family (Technical)**: `JetBrains Mono`. Used for technical specs, pricing, and status badges to give a "data-driven" and "precise" feel.
- **Letter Spacing**: Applied `tracking-[-0.04em]` to Antonio titles and `tracking-[0.2em]` to subheaders for that premium editorial aesthetic.
- **Case Transformation**: Standardized `uppercase` across all card titles and metadata for a consistent "Command Center" feel.

## 2. Card Aesthetics (The "Elite" Look)
- **Glassmorphism**: Implemented `backdrop-blur-md` and semi-transparent backgrounds (`bg-white/10` or `bg-[#121212]`) for a high-end, modern UI.
- **Borders & Glow**: Used subtle borders (`border-white/5` or `border-gray-100`) with soft shadows to make cards feel like they are floating.
- **Gradients**: Applied a `bg-gradient-to-t from-black/80 to-transparent` overlay on billboard images to ensure text remains perfectly legible regardless of the photo used.
- **Corner Radii**: Standardized on large, smooth corners (`rounded-2xl` or `rounded-[32px]`) for a premium industrial design feel.

## 3. Data & Technical Specs
- **Dynamic Specs Grid**: Built a specific grid to display billboard-specific data:
    - **Traffic Volume**: (e.g., "1.2M Weekly Traffic") with a `MapPin` or `Users` icon.
    - **Screen Resolution**: (e.g., "3840 x 2160" or "4K Display") with a `Monitor` icon.
    - **Dimensions**: (e.g., "12m x 4m") to show physical size.
    - **Minimum Duration**: (e.g., "1 Week Slot").
- **Pricing Display**: Large, bold pricing in **GH₵** with a clear "Weekly Rate" label using JetBrains Mono for readability.

## 5. Billboard Booking Workflow (Final UI)
This covers the transition from the catalog to the campaign finalization page.

### A. Page Architecture
- **Layout**: Migrated from standard admin layouts to a high-fidelity **Public Marketing Layout**.
- **Header/Footer**: Uses `WebsiteHeader` and `WebsiteFooter` with the **TopBar** utility for a consistent global brand presence.
- **Hero Unit**: `ProductsHero` component with:
    - **Title**: "CAMPAIGN"
    - **Highlight**: "BOOKING"
    - **Aesthetics**: Muted grey highlight color (`#b8b3b4`) and blurred billboard background.

### B. The Booking Form (Campaign & Identity)
- **Section 1: Campaign Strategy**:
    - **Icons**: `Briefcase`, `Calendar`, `Clock`.
    - **Fields**: High-contrast inputs with rounded-2xl corners (`rounded-2xl`).
    - **Logic**: Intelligent category selection (Real Estate, Tech, Retail, etc.).
- **Section 2: Advertiser Identity**:
    - **Icons**: `User`, `Mail`, `Phone`, `Building2`.
    - **Style**: Soft background focus (`bg-gray-50/30`) that turns white on interaction.
- **Primary Action**: 
    - Full-width, high-impact button: "SUBMIT FORMAL BOOKING REQUEST".
    - Aesthetic: `bg-[#1a1a1a]` with `hover:bg-[#eea000]` and deep shadow.

### C. Sidebar (Cost Summary & Urgency)
- **Aesthetic**: Ultra-dark (`#1a1a1a`) card with golden accents (`#eea000`).
- **Urgency Logic**: "High Traffic Slot" alert box featuring occupancy rates (e.g., "92% occupancy") to drive conversion.
- **Cost Table**: Clean, bold pricing lines for "Weekly Rate" and "Media Tax" with a massive tracking-tighter total.
- **Next Phases Stepper**: A vertical 1-2-3-4 step indicator using the "Manono Gold" (`#ffcc00`) for active states.

### D. Post-Booking (Success State)
- **Visuals**: Full-screen centered success message.
- **Iconography**: Large `CheckCircle2` in an emerald-glow circle.
- **Buttons**: Rounded-full buttons for "Browse More Slots" (outline) and "Return Home" (solid black).

## 6. Inventory Control & Command Center (Admin UI)
The back-end systems designed to manage these billboards with precision.

### A. Intelligent Billboard Form
- **Location Detection Logic**: 
    - A dedicated "Detect" button that can parse coordinates directly from a **Google Maps Link** or text.
    - Built-in map preview using an `iframe` that updates instantly when coordinates are entered.
- **Technical Specs Grid**:
    - **Display Types**: SMD LED, Digital LCD, etc.
    - **Resolution Presets**: P4, P6, P8, P10.
    - **Orientation**: Landscape vs Portrait logic.
- **Scheduling Controls**:
    - **Wake/Sleep Time**: Automated power-down scheduling.
    - **Loop Capacity Logic**: Real-time calculation of ad repeat frequency based on slots and duration.
- **Media Management**:
    - Separate upload zones for "Main Feature Photo", "Video Showcase", and a "Location Gallery".

### B. Navigation & Organization
- **Sidebar Overhaul**:
    - **Icons**: Switched from `Package` to `Layers` for Inventory to reflect the multi-faceted nature of billboard slots.
    - **Grouping**: Created "Website Control" and "Administration Console" sections for better separation of concerns.
    - **Labels**: High-level terms like "Public Products" and "System Settings".
- **Hover Effects**: 
    - **Image Zoom**: `group-hover:scale-110` with a slow `duration-[1.5s]` for a cinematic feel.
    - **Vertical Lift**: Cards lift slightly (`hover:-translate-y-2`) on hover to indicate interactivity.
    - **Button Glow**: Primary buttons expand or glow when the card is hovered.
- **Action Buttons**:
    - **"BOOK ADVERTISING SLOT"**: A high-impact, full-width button with a clear call-to-action.
    - **Arrow Animation**: The `ArrowRight` icon translates horizontally (`group-hover:translate-x-2`) to guide the user's eye.
- **Status Badges**:
    - **"Available"**: Bright gold (`#eea000`) background with black text.
    - **"Verified"**: A soft blue/green badge with a checkmark icon to build trust.

## 5. Layout & Responsiveness
- **Grid System**: Implemented `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` to ensure cards scale perfectly from mobile to large desktop screens.
- **Aspect Ratios**: Carefully tuned the image containers (switching between `aspect-[21/7]` for bars and `h-72` for portrait-style cards) to ensure high-quality asset display.
- **Vertical Alignment**: Used `flex flex-col h-full` to ensure that all cards in a row have equal height, regardless of text length, maintaining a clean grid line.

## 6. Integration with Database
- **Mapping Logic**: Built an adapter to map the Prisma `Billboard` model fields (`weeklyRate`, `screenType`, `city`) directly to the UI card props.
- **Image Fallbacks**: Implemented fallback paths (e.g., `/billboards/bill_boards1.webp`) to ensure cards never look "broken" if a database image is missing.
