# Deployment Guide

Complete guide for deploying Any-Horizon IoT Forecaster to Vercel.

## Pre-Deployment Checklist

- [ ] LLM API credentials ready
- [ ] GitHub repository created (optional, for GitHub deployment)
- [ ] Vercel account created
- [ ] Environment variables prepared
- [ ] All tests passing locally

## Method 1: Vercel CLI Deployment (Recommended)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Link Project

From your project directory:

```bash
vercel link
```

Choose:
- Create new project or link existing
- Select your Vercel account/team
- Confirm project name

### Step 4: Set Environment Variables

```bash
vercel env add LLM_BASE_URL production
vercel env add LLM_API_KEY production
vercel env add LLM_MODEL_NAME production
vercel env add LLM_TEMPERATURE production
vercel env add MAX_HORIZON_STEPS production
vercel env add MAX_ROWS_PER_SENSOR production
vercel env add ENABLE_REQUEST_LOGGING production
```

Enter values when prompted.

### Step 5: Deploy to Preview

Test deployment:

```bash
vercel
```

This creates a preview deployment. Visit the URL to test.

### Step 6: Deploy to Production

```bash
vercel --prod
```

Your app is now live!

## Method 2: GitHub Integration

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

In the Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add each variable:

| Variable | Value | Environment |
|----------|-------|-------------|
| `LLM_BASE_URL` | `https://api.openai.com/v1/chat/completions` | Production, Preview, Development |
| `LLM_API_KEY` | Your API key | Production, Preview, Development |
| `LLM_MODEL_NAME` | `gpt-4-turbo-preview` | Production, Preview, Development |
| `LLM_TEMPERATURE` | `0` | Production, Preview, Development |
| `MAX_HORIZON_STEPS` | `2000` | Production, Preview, Development |
| `MAX_ROWS_PER_SENSOR` | `100000` | Production, Preview, Development |
| `ENABLE_REQUEST_LOGGING` | `true` | Production, Preview, Development |

### Step 4: Deploy

Click "Deploy" and wait for build to complete.

## Post-Deployment

### Verify Deployment

1. Visit your deployment URL
2. Test file upload with sample dataset
3. Generate a forecast
4. Download results
5. Check for any console errors

### Smoke Test Checklist

- [ ] Upload page loads correctly
- [ ] Sample CSV uploads successfully
- [ ] Data profiling completes
- [ ] Forecast configuration page renders
- [ ] Forecast generates successfully
- [ ] Chart displays correctly
- [ ] CSV download works
- [ ] JSON config download works
- [ ] Mobile responsive design works
- [ ] No console errors

### Monitor Deployment

In Vercel dashboard:

1. **Functions** tab - Check API route execution
2. **Analytics** tab - Monitor traffic
3. **Logs** tab - View runtime logs
4. **Deployments** tab - Track deployment history

## Configuration

### Domain Setup

1. Go to Project Settings → Domains
2. Add custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning

### Function Timeout

API routes have different timeout limits:

- `/api/profile` - 30 seconds (configured in `vercel.json`)
- `/api/forecast` - 60 seconds (configured in `vercel.json`)

To modify:

```json
{
  "functions": {
    "app/api/forecast/route.ts": {
      "maxDuration": 60
    }
  }
}
```

### Memory Limits

Vercel serverless functions have memory limits:

- **Hobby**: 1024 MB
- **Pro**: 3008 MB
- **Enterprise**: Custom

For large datasets, upgrade plan if needed.

## Environment-Specific Configuration

### Development

```bash
# .env.local
LLM_BASE_URL=http://localhost:8000/v1/chat/completions
LLM_API_KEY=test_key
ENABLE_REQUEST_LOGGING=true
```

### Preview (Staging)

Use preview environment in Vercel for testing before production.

### Production

- Use production API keys
- Enable request logging
- Monitor usage and costs

## Troubleshooting

### Build Failures

**Error: "Module not found"**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Error: "Type errors"**
```bash
# Check TypeScript
npm run build
```

### Runtime Errors

**Error: "LLM configuration missing"**
- Verify environment variables in Vercel dashboard
- Redeploy after adding variables

**Error: "Function timeout"**
- Increase timeout in `vercel.json`
- Optimize data processing
- Reduce context window size

**Error: "Memory limit exceeded"**
- Upgrade Vercel plan
- Reduce MAX_ROWS_PER_SENSOR
- Optimize data structures

### Performance Issues

**Slow API responses**
- Check LLM API latency
- Reduce context window (default: 1024 points)
- Enable caching if available

**Large bundle size**
- Analyze bundle: `npm run build`
- Use dynamic imports for heavy libraries
- Optimize images and assets

## Monitoring & Analytics

### Enable Vercel Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

Install package:
```bash
npm install @vercel/analytics
```

### Custom Logging

Logs are automatically sent to Vercel. View in dashboard under "Logs" tab.

Add structured logging:

```typescript
console.log(JSON.stringify({
  level: 'info',
  message: 'Forecast completed',
  run_id: 'fc_123',
  duration_ms: 2500
}));
```

## Security Best Practices

### API Key Protection

- Never commit API keys to Git
- Use environment variables only
- Rotate keys regularly
- Use separate keys for dev/prod

### Rate Limiting

Add rate limiting middleware:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const now = Date.now();

  const limit = rateLimitMap.get(ip);

  if (limit && limit.reset > now) {
    if (limit.count >= 10) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    limit.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, reset: now + 60000 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

### CORS Configuration

Already configured in `vercel.json` for API routes. Adjust as needed:

```json
{
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://your-domain.com"
        }
      ]
    }
  ]
}
```

## Scaling Considerations

### Serverless Function Limits

- **Execution time**: Max 60s (configured)
- **Payload size**: 4.5 MB request, 4.5 MB response
- **Concurrent executions**: Based on plan

### Database Integration (Phase 2)

For persistent storage:

1. Add Vercel Postgres or external DB
2. Store forecast history
3. Cache data profiles
4. Track usage metrics

### CDN & Caching

Vercel automatically provides:
- Edge network delivery
- Static asset caching
- API route caching (configure as needed)

## Rollback Procedure

If deployment has issues:

### Via Dashboard
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Via CLI
```bash
vercel rollback
```

## Updating Deployment

### Code Changes

```bash
git add .
git commit -m "Update message"
git push
```

Vercel auto-deploys on push (if GitHub integration enabled).

Or manually:
```bash
vercel --prod
```

### Environment Variables

```bash
vercel env rm LLM_API_KEY production
vercel env add LLM_API_KEY production
```

Then redeploy to apply changes.

## Cost Optimization

### Vercel Pricing Tiers

- **Hobby**: Free (100GB bandwidth, 100 hours execution)
- **Pro**: $20/month (1TB bandwidth, 1000 hours)
- **Enterprise**: Custom pricing

### LLM API Costs

Monitor token usage:
- Reduce context window size
- Cache frequent requests
- Use cheaper models for testing

### Optimization Tips

1. Enable response caching
2. Compress payloads
3. Optimize images
4. Use edge functions where possible
5. Monitor analytics to identify bottlenecks

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Status Page](https://www.vercel-status.com/)

## Maintenance

### Regular Tasks

- [ ] Monitor error rates weekly
- [ ] Review LLM API usage monthly
- [ ] Update dependencies quarterly
- [ ] Rotate API keys as needed
- [ ] Review and optimize logs
- [ ] Check for security updates

### Backup Strategy

Since this is a stateless application:
- Keep Git repository updated
- Document environment variables securely
- Export important forecast configurations

---

**Deployment Complete!** Your Any-Horizon IoT Forecaster is now live on Vercel.
