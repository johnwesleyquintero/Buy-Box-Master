# 📦 Buy Box Master

**Version:** 1.2
**Stack:** React, TypeScript, Vite, TailwindCSS

A lightning-fast tool designed to analyze **Keepa CSV exports** and instantly detect Buy Box status for Amazon Sellers.

## 🎯 Purpose

This tool eliminates the manual labor of checking line-by-line spreadsheet data. It parses standard Keepa exports to determine:
1. **Who has the Buy Box?** (You vs. Competitors vs. Suppressed)
2. **Pricing Delta:** How far off is your price from the winner?
3. **Action Items:** Instant recommendations (Hold, Reprice, Fix Listing).

## 🧠 Logic

### Seller Identification
The app identifies "Winning" status if the `Buy Box Seller` column matches one of the **Brand Identities** you configure in the settings.

### Status Definitions
* **✅ WON:** You hold the Buy Box.
* **❌ LOST:** A competitor holds the Buy Box.
* **⚠️ SUPPRESSED:** No Buy Box price exists (listing likely broken or price too high).

## 🚀 Usage

1. **Configure:** Click "Brands" and add your seller names/aliases.
2. **Export Data:** Go to Keepa > Data > Export CSV.
3. **Upload:** Drag & drop the CSV into the dashboard.
4. **Analyze:** View the Win Rate breakdown and filtered action list.

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

* `src/components`: UI blocks (FileUpload, ResultsTable, Summary, SettingsModal).
* `src/utils`: Core logic for parsing CSVs and determining seller status.
* `src/types.ts`: TypeScript interfaces for Keepa rows and internal state.
* `src/constants.ts`: Configuration and defaults.

---
*Built for Amazon Sellers.*