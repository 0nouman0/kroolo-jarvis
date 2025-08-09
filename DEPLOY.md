# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from this directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Yes**
   - Which scope? **Your personal account**
   - Link to existing project? **No**
   - What's your project's name? **kroolo-jarvis** (or your preferred name)
   - In which directory is your code located? **./**

### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub** (already done)
2. **Go to [vercel.com](https://vercel.com)**
3. **Click "New Project"**
4. **Import from GitHub**: Select `0nouman0/kroolo-jarvis`
5. **Configure Project**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Add Environment Variables** (see below)
7. **Click Deploy**

## 🔧 Environment Variables Setup

In your Vercel dashboard, add these environment variables:

### Required Variables:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Optional Variables:
```
VITE_APP_URL=https://your-app-name.vercel.app
```

## 📝 Getting Your API Keys

### Supabase Setup:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy your Project URL and anon/public key

### Gemini AI Setup:
1. Go to [Google AI Studio](https://makersuite.google.com)
2. Create a new API key
3. Copy the API key

## 🔄 Automatic Deployments

Once connected to GitHub, Vercel will automatically deploy on every push to the main branch.

## 📱 Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Click on "Domains" tab
3. Add your custom domain
4. Follow DNS configuration instructions

## 🐛 Troubleshooting

### Build Fails:
- Check if all dependencies are in package.json
- Ensure environment variables are set
- Check build logs in Vercel dashboard

### App Doesn't Load:
- Verify environment variables are set correctly
- Check browser console for errors
- Ensure Supabase and Gemini API keys are valid

## 🎉 Success!

Your Policy Analysis app should now be live at: `https://your-app-name.vercel.app`
