# 📦 Buy Box Master

**Version:** 1.0  
**Stack:** React, TypeScript, Vite, TailwindCSS

A lightning-fast internal tool designed to analyze **Keepa CSV exports** and instantly detect Buy Box status for **SecuLife** and **SpeedTalk Mobile** ASINs.

## 🎯 Purpose

This tool eliminates the manual labor of checking line-by-line spreadsheet data. It parses standard Keepa exports to determine:
1. **Who has the Buy Box?** (Us vs. Competitors vs. Suppressed)
2. **Pricing Delta:** How far off is our price from the winner?
3. **Action Items:** Instant recommendations (Hold, Reprice, Fix Listing).

## 🧠 Logic

### Seller Identification
The app identifies "Winning" status if the `Buy Box Seller` column matches one of our known aliases (case-insensitive):
* `SecuLife`
* `SpeedTalk Mobile`
* `SpeedTalk Mobile Store`
* `Wes/YourStoreName`

### Status Definitions
* **✅ WON:** We hold the Buy Box.
* **❌ LOST:** A competitor holds the Buy Box.
* **⚠️ SUPPRESSED:** No Buy Box price exists (listing likely broken or price too high).

## 🚀 Usage

1. **Export Data:** Go to Keepa > Data > Export CSV.
2. **Upload:** Drag & drop the CSV into the dashboard.
3. **Analyze:** View the Win Rate breakdown and filtered action list.

## 🛠️ Development

This project uses a standard Vite + React setup.

```bash
# Install dependencies
npm install

# Start local server
npm run dev

# Build for production
npm run build
```

## 📂 Project Structure

* `src/components`: UI blocks (FileUpload, ResultsTable, Summary).
* `src/utils`: Core logic for parsing CSVs and determining seller status.
* `src/types.ts`: TypeScript interfaces for Keepa rows and internal state.
* `src/constants.ts`: Configuration for Seller Names and thresholds.

---
*Internal Tool for Operations & Strategy.*
