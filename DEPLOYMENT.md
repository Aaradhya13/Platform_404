# Vercel Deployment Guide

## Steps to Deploy on Vercel

1. **Build the project locally first to ensure no errors:**
   ```bash
   npm run build
   ```

2. **Push your code to GitHub** (if not already done)

3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project

4. **Environment Variables:**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add these variables:
     - `VITE_BASE_URL` = `https://platform-404.onrender.com/`
     - `VITE_PINATA_JWT` = `your_jwt_token`

5. **Deploy Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## Troubleshooting

If you still see a blank page:

1. **Check Vercel Function Logs:**
   - Go to your Vercel dashboard
   - Click on your deployment
   - Check the "Functions" tab for any errors

2. **Check Browser Console:**
   - Open browser developer tools (F12)
   - Look for JavaScript errors in the Console tab

3. **Check Network Tab:**
   - See if all assets are loading properly
   - Look for 404 errors on CSS/JS files

4. **Verify Environment Variables:**
   - Make sure all VITE_ prefixed variables are set in Vercel

## Common Issues

- **Blank page**: Usually caused by JavaScript errors or missing environment variables
- **404 on refresh**: Fixed by the rewrites in vercel.json
- **Assets not loading**: Check if public folder files are being served correctly

## Files Modified for Deployment

- `vercel.json` - Updated to modern Vercel configuration
- `vite.config.js` - Added proper build configuration
- `.env.production` - Production environment variables
- `.vercelignore` - Exclude unnecessary files from deployment
- `ErrorBoundary.jsx` - Catch runtime errors
- `main.jsx` - Added error boundary wrapper