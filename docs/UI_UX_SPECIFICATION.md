# UI/UX Design System Specification
## Dimension Style Reference Applied to EcoResearch AI

---

## 1. Aesthetic Vision & Design Philosophy

**Dimension** operates as a dusk-lit AI workspace tailored for high-focus research work:
- **Canvas & Tone**: Deep matte-black canvases (`#0a0a0a`) carry frosted-glass translucent panels (`#d4d4d4` @ 10% opacity), pill-shaped controls, and whisper-weight headlines.
- **Color Discipline**: Almost entirely monochromatic — white (`#ffffff`), bone (`#ededed`), ash (`#c2c2c2`), and slate (`#686868`) provide typography hierarchy. 
- **Chromatic Accent**: A single violet accent wash (`--color-dusk-violet`: `#6b62f2` at 0.565 alpha) used sparingly in horizontal gradient washes or spotlight radial glows.
- **Geometry**: Pill-shaped buttons (`9999px`), subtle UI radii (`10px`), card radii (`24px`), large panel radii (`40px–42px`), with hairline 1px borders (`#e5e5e5` at low opacity).
- **Typography**: DM Sans for primary display headlines and body UI; Geist for technical section headers and information-dense report views.

---

## 2. Universal Citation UI Design

### Component: Interactive Citation Pill & Hover Popover
- **Inline Pill Token**: `[Doc 04, p. 12]`
  - Background: `#161616` (Graphite)
  - Border: 1px `#e5e5e5` (Hairline) at 20% opacity
  - Typography: 13px DM Sans, `--color-ash` (`#c2c2c2`)
  - Shape: `9999px` border-radius pill
  - Cursor: Pointer with subtle hover glow in `--color-dusk-violet`

- **Hover Popover Window (Frosted Glass)**:
  - Surface: `rgba(212,212,212,0.1)` with 8px backdrop-blur
  - Border-radius: `19px`
  - Content:
    - **Header**: Document Name (`IPCC_AR6_WGIII.pdf`), Page 12, Paragraph 3
    - **Quote Body**: Verbatim text snippet highlighted with subtle dusk violet underline
    - **Action**: "View Full Document Page" link

---

## 3. Core Application UI Components

### Component 1: Floating Frosted Header & Workspace Nav
- **Style**: Graphite surface (`#161616`), 19px asymmetric border-radius, 4px backdrop blur, 1px `#e5e5e5` hairline border.
- **Elements**: EcoResearch Logo + Active Workspace Selector ("IPCC 2024 Climate Policy") + Pill Nav Links (Chat Q&A, Report Studio, Document Vault) + Primary White Pill CTA ("New Report").

### Component 2: Multi-Document Vault (Batch Ingestion Panel)
- **Dropzone Card**: Frosted glass panel (`rgba(212,212,212,0.1)` background, 24px border-radius, 28px padding).
- **Document Status List**: Numbered feature row layout showing uploaded papers (e.g. `01 | IPCC_AR6_WGIII_Full_Report.pdf | 1,240 pages | Ready`).
- **Batch Upload Pill**: Supports dragging 20–50 files simultaneously with progress pill indicator.

### Component 3: Dusk-Lit Dual-Pane Research Studio

```
+-----------------------------------------------------------------------------------+
| FLOATING FROSTED NAV BAR                                                         |
+-----------------------------------------------------------------------------------+
|  DOCUMENT VAULT SIDEBAR (25%)   |   CHAT & REPORT GENERATOR CANVAS (75%)         |
|  - 42 Uploaded Papers           |   [ Status Banner: LangGraph Citation Audit ]  |
|  - Active Filters (EU, 2024)    |                                                |
|  - Ingest Progress Pill         |   [ Dynamic Q&A Thread with Mandatory Pills ]  |
|                                 |   User: "Summarize carbon tax frameworks..."   |
|  [ + Ingest More PDFs ]         |   AI: "Based on [Doc 04, p.12] and [Doc 18, p.3]|
|                                 |        carbon pricing in the EU..."            |
|                                 |                                                |
|                                 |   [ LangGraph Report Studio Tab ]              |
|                                 |   - Interactive Outline Builder                |
|                                 |   - Markdown Preview with Citation Hover Cards|
|                                 |   - Auto-Generated Bibliography Appendix       |
|                                 |   - Export Pill (PDF / DOCX)                   |
+-----------------------------------------------------------------------------------+
```

---

## 4. UI/UX Do's and Don'ts

### Do
- Ensure **every single LLM response** displays hoverable citation pills `[Doc X, p. Y]`.
- Always use **9999px border-radius** for primary action CTAs, navigation pills, and citation tags.
- Use `#ededed` for primary readable copy on dark canvas to eliminate eye strain.
- Reserve the **Dusk Violet (#6b62f2)** accent solely for horizontal gradient washes or active AI thinking indicators.

### Don't
- Do not display uncited text statements in the UI — ungrounded statements must be flagged with a warning pill.
- Do not use heavy box-shadows for elevation — rely strictly on frosted translucency and hairline edge definition.
- Do not use bold weight 700+ headlines — DM Sans / Geist at weight 500 with tight tracking creates superior editorial elegance.
