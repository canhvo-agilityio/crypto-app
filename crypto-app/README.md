# PWA Practice

## Overview

- This document concerns pwa practice. Build the Crypto web application to see coin rates.

## Target

- Build a Progressive Web Application (PWA)
- Understand what a PWA is
- Learn why it should be used
- Understand caching strategies and offline data handling.
- Push Notifications

## Technical Stack

- React
- Typescript
- Vite
- PWA Vite Plugin

## Features

- Live crypto price display
- Daily change (+/-)
- Push notification
- Offline support
- Handle background sync

### Installation

1. **Clone the repository:**

   ```bash
   git@gitlab.asoft-python.com:canh.vo/pwa-training.git
   ```

2. **Checkout into "crypto-app" branch:**

   ```bash
   git checkout crypto-app
   ```

3. **Install dependencies:**

   ```bash
   cd crypto-app
   ```

   ```bash
   pnpm install
   ```

4. **Start the project**

   | Script         | Description                                           |
   | -------------- | ----------------------------------------------------- |
   | `pnpm dev`     | Starts the development server using Vite              |
   | `pnpm build`   | Builds the app for production using TypeScript + Vite |
   | `pnpm preview` | Serves the production build locally                   |
