# VoiceFront - Vercel Deployment Guide

Your Next.js frontend is now configured for serverless deployment on Vercel!

## ✅ What's Been Done

1. **Next.js Optimizations** - Configured for Vercel's serverless environment
2. **vercel.json** - Created with serverless function settings:
   - Function memory: 512 MB
   - Maximum duration: 60 seconds
   - Region: iad1 (US East)
3. **Build System** - Production build verified and working
4. **Development Server** - Tested locally on port 3000

## 📋 Prerequisites

Before deploying, ensure you have:
- A GitHub/GitLab/Bitbucket account with this repo
- A Vercel account (https://vercel.com)

## 🚀 Deployment Steps

### 1. Push to Version Control
```bash
# From your project directory
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel (Choose One Method)

#### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Deploy from project directory
cd /path/to/voicefront
vercel
```

Follow the prompts:
- Connect your Git repository
- Set project name
- Configure environment variables

#### Option B: GitHub/GitLab Integration
1. Go to https://vercel.com/new
2. Import your repository
3. Vercel auto-detects Next.js framework
4. Click "Deploy"

### 3. Set Environment Variables

In the Vercel dashboard:
1. Go to **Project Settings** → **Environment Variables**
2. Add these variables:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://swayamshetkar-vdub-orchestrator.hf.space/
   ```
   (Or your own backend URL)

### 4. Deploy

The deployment will automatically:
- Install dependencies
- Run `npm run build`
- Deploy serverless functions
- Optimize and cache assets

Your app will be live at: `https://<your-project>.vercel.app`

## 🔧 Serverless Configuration

The `vercel.json` file specifies:
- **Memory**: 512 MB per function (adjustable 128MB-3GB)
- **Max Duration**: 60 seconds (Hobby plan limit)
- **Cold Start Optimization**: Automatic with Vercel

### To Increase Limits (Pro Plan):
```json
{
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 300
    }
  }
}
```

## 🌍 Custom Domain

To add a custom domain in Vercel:
1. Dashboard → **Project** → **Settings** → **Domains**
2. Add your domain
3. Update DNS records with provided Vercel nameservers

## 📊 Monitoring

Track your deployment:
- **Logs**: Dashboard → **Deployments** → **Runtime Logs**
- **Analytics**: **Analytics** tab shows performance metrics
- **Error Tracking**: Check **Functions** tab for serverless errors

## 🔄 Continuous Deployment

Every push to your main branch automatically:
1. Triggers a new build
2. Runs tests (if configured)
3. Deploys if successful
4. Previous versions remain accessible

## 🛠️ Local Testing Before Deploy

```bash
# Test production build locally
npm run build
npm run start
# Visit http://localhost:3000
```

## 📝 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API endpoint | `https://your-api.hf.space/` |

**Note**: Variables starting with `NEXT_PUBLIC_` are exposed to the browser.

## ⚡ Performance Tips

1. **Enable Edge Caching** - Already configured in next.config.js
2. **Optimize Images** - Use Vercel's Image Optimization
3. **Monitor Serverless Duration** - Keep functions under 60s
4. **Use ISR (Incremental Static Regeneration)** - For dynamic pages

## 🐛 Troubleshooting

### Build Fails
- Check `npm run build` locally first
- Verify all dependencies in package.json
- Check for TypeScript/ESLint errors

### Backend Connection Issues
- Verify `NEXT_PUBLIC_BACKEND_URL` is set
- Check CORS headers on backend
- Test endpoint with `curl` or Postman

### Slow Cold Starts
- Reduce dependencies
- Upgrade to Vercel Pro
- Use Edge Functions for simple requests

## 📚 Useful Links

- [Vercel Next.js Guide](https://vercel.com/docs/frameworks/nextjs)
- [Serverless Functions Docs](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Pricing](https://vercel.com/pricing)

---

**Status**: ✅ Ready for Vercel Deployment
