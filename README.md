# Excel File Viewer

A modern web application built with Next.js that allows you to upload and view Excel files in a beautiful table format.

## Features

- 📤 Upload Excel files (.xlsx, .xls, .csv)
- 📊 Display data in a responsive table
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast client-side processing with xlsx library
- 🔄 Loading states and error handling
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click on the upload area or drag and drop an Excel file
2. The file will be parsed automatically
3. View your data in a formatted table with:
   - Sticky header for easy navigation
   - Hover effects on rows
   - File info display (name, rows, columns)
   - Scrollable content area

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Excel Parser**: xlsx library
- **UI**: React with hooks

## Project Structure

```
├── app/
│   ├── page.tsx          # Main Excel viewer component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── public/               # Static assets
└── package.json          # Dependencies
```

## Key Features Implementation

### File Upload
- Accepts .xlsx, .xls, and .csv files
- Client-side file processing
- No server upload required

### Data Display
- First row treated as header
- Automatic column detection
- Responsive table with horizontal/vertical scroll
- Empty cell handling

### Error Handling
- Invalid file format detection
- User-friendly error messages
- Loading states during parsing

## API Reference

### Main Component Props

The `page.tsx` component manages:
- `data`: 2D array of Excel data
- `fileName`: Uploaded file name
- `loading`: Upload/parse state
- `error`: Error message state

### Excel Parsing

Uses `xlsx` library:
```typescript
XLSX.read(arrayBuffer)              // Parse workbook
XLSX.utils.sheet_to_json(worksheet) // Convert to JSON
```

## Deployment to SAP Cloud Foundry

This application is ready to deploy to SAP Cloud Foundry. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Quick Deploy

```bash
# Login to Cloud Foundry
cf login -a <API_ENDPOINT>

# Build the application
npm install
npm run build

# Deploy to Cloud Foundry
npm run cf:push
```

The application will be available at the URL provided by Cloud Foundry after deployment.

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Deploy to Cloud Foundry
npm run cf:push
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
