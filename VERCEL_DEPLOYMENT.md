# Vercel Deployment Guide

## Prerequisites
- Vercel account
- Vercel CLI installed: `npm i -g vercel`

## Deployment Steps

### 1. Build the project locally (test first)
```bash
npm run build:ssr:prod
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
vercel
```

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`

### 3. Environment Variables (Set in Vercel Dashboard)
- `NODE_ENV`: `production`

## Important Notes
- The app uses Angular Universal SSR
- Production API: `https://sa-apis.bayfay.com/admin`
- Node version: 14.x (set in Vercel project settings if needed)

## Troubleshooting
If build fails:
1. Check Node version is 14.x
2. Ensure `npm install --legacy-peer-deps` is used
3. Verify all environment files are correct
