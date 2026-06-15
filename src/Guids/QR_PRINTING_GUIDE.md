# QR Code Printing Feature Documentation

## Overview
The QR code printing functionality allows users to generate, preview, and print QR code labels for single or multiple items. This feature includes:
- Individual item QR code printing
- Bulk printing of multiple items with grid layout
- Print-friendly designs optimized for label printing
- Download capability for individual QR codes

## Features Implemented

### 1. Single Item QR Printing
**File:** `src/components/QRPrintSingle.jsx`

Users can print QR codes for individual items with the following information:
- Item name
- Item ID
- Serial number
- Item status
- Item description (if available)
- Generated QR code containing the unique item identifier

**Features:**
- Print button to open print dialog
- Download button to save QR code as PNG
- Professional card layout with proper spacing
- Print-optimized styling

### 2. Bulk Item QR Printing
**File:** `src/components/QRPrintBulk.jsx`

Users can select multiple items and generate a grid-based print layout:
- Grid layout with 3 columns per page (12 items per page)
- Automatic pagination for large batches
- Print header with generation timestamp
- Each label includes item name and serial number

**Features:**
- Multi-page support for large quantities
- Page-break optimization for printing
- Clean grid layout suitable for label stickers
- Professional header on first page

### 3. Integration with Dashboard
**File:** `src/pages/CompanyDashboard.jsx`

The CompanyDashboard has been enhanced with QR printing capabilities:
- **Individual Print:** Each item card has a "🖨️ Print QR" button
- **Bulk Selection Mode:** Toggle button to enter multi-select mode
- **Selection Controls:** 
  - Individual item checkboxes
  - "Select All" / "Deselect All" button
  - Print button showing count of selected items
- **Item Counter:** Displays total number of items

### 4. Styling
**File:** `src/App.css`

Added comprehensive print-friendly styles:
- `qr-print-modal` - Single item QR print modal
- `qr-bulk-modal` - Bulk QR print modal
- `qr-labels-grid` - Grid layout for bulk labels
- `qr-label` - Individual label styling
- Print media queries for optimal print output
- Responsive design for mobile devices

## Component Architecture

### QRPrintSingle Component
```jsx
<QRPrintSingle 
  item={item}          // Item object with id, name, serialNumber, status, description
  onClose={handleClose} // Callback to close modal
/>
```

### QRPrintBulk Component
```jsx
<QRPrintBulk 
  items={items}        // Array of item objects
  onClose={handleClose} // Callback to close modal
/>
```

## How to Use

### Printing a Single Item
1. Navigate to the Company Dashboard
2. In the items list, click the "🖨️ Print QR" button on any item
3. Preview the QR code in the modal
4. Click "🖨️ Print" to open the print dialog or "⬇️ Download" to save as PNG

### Printing Multiple Items
1. Click "☑ Select Items" button to enter selection mode
2. Check the boxes next to items you want to print
3. Use "Select All" to quickly select all items
4. Click "🖨️ Print N" button (where N is the count)
5. In the bulk print modal, click "🖨️ Print All" to print all selected items

### Print Settings
**For Single Items:**
- Paper size: Auto (adapts to content)
- Orientation: Portrait
- Margins: 20mm
- Layout: Centered card

**For Multiple Items:**
- Paper size: A4
- Orientation: Portrait
- Margins: 10mm
- Layout: 3-column grid
- Items per page: 12

## QR Code Format
The QR codes are generated with the following format:
- **Value:** `QR-{FIRST_8_CHARS_OF_ITEM_ID}`
- **Size:** 256px for single items, 120px for bulk items
- **Error Correction Level:** H (High - can recover from 30% damage)
- **Format:** PNG (generated client-side using qrcode.react)

## API Endpoints (Optional Backend Integration)
If backend QR generation is needed, the following endpoints are available in the API service:

```javascript
// Single item QR
GET /items/:id/qr

// Bulk QR generation
POST /items/qr/bulk
{ itemIds: [id1, id2, ...] }

// Download single QR label
GET /items/:id/qr/download

// Download bulk QR labels
POST /items/qr/bulk/download
{ itemIds: [id1, id2, ...] }
```

## Dependencies
- `qrcode.react` (^3.0.3) - Client-side QR code generation

## Browser Compatibility
- Modern browsers with Print API support
- Chrome/Edge 60+
- Firefox 55+
- Safari 12+

## Print Tips
1. **For labels:** Use adhesive label sheets (e.g., Avery labels)
2. **Paper:** Standard A4 or custom label sheets
3. **Print quality:** Use "Best" or "High" quality settings
4. **Color:** Works in both color and grayscale
5. **Scaling:** Adjust printer settings to "Fit to page" if needed

## Performance Considerations
- QR codes are generated client-side (no server load)
- Bulk printing supports up to 100+ items (limited by pagination)
- Each page contains 12 items in 3-column layout
- Print preview is generated in-memory without external downloads

## Troubleshooting

### QR Code Not Generating
- Ensure item has a valid ID
- Check browser console for errors
- Verify qrcode.react library is installed

### Print Layout Issues
- Adjust printer margins to 10mm for bulk prints
- Use "Fit to Page" option in print settings
- Check page orientation is set to Portrait

### Large Batch Printing
- Select items in batches of 50-100 for optimal performance
- Print one page at a time if experiencing lag
- Use "Print All" to print all pages at once

## Future Enhancements
- PDF export functionality
- Custom label template design
- Barcode generation (in addition to QR)
- Scheduled batch printing
- Print history logging
- Integration with thermal printers
