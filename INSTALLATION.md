# Installation & Setup Guide

Complete installation guide for Any-Horizon IoT Forecaster.

## System Requirements

- **Node.js**: 18.17.0 or higher
- **npm**: 9.0.0 or higher (comes with Node.js)
- **Operating System**: macOS, Linux, or Windows
- **Memory**: 2GB RAM minimum
- **Disk Space**: 500MB free space

### Check Prerequisites

```bash
# Check Node.js version
node --version
# Should show v18.17.0 or higher

# Check npm version
npm --version
# Should show 9.0.0 or higher
```

If you need to install Node.js:
- Download from [nodejs.org](https://nodejs.org/)
- Or use a version manager (nvm, fnm)

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd any-horizon-forecaster
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- Next.js and React
- TypeScript
- Tailwind CSS
- Recharts (charting)
- PapaParse (CSV parsing)
- date-fns (date handling)
- Zod (validation)
- simple-statistics (math)
- All development tools

**Expected output**:
```
added 387 packages, and audited 388 packages in 45s
```

**Installation time**: 1-3 minutes depending on internet speed

### 3. Create Environment File

```bash
cp .env.local.example .env.local
```

### 4. Configure Environment Variables

Edit `.env.local` with your preferred editor:

**For macOS/Linux**:
```bash
nano .env.local
# or
vim .env.local
# or
code .env.local  # if using VS Code
```

**For Windows**:
```bash
notepad .env.local
```

**Required configuration**:
```env
# LLM Configuration (REQUIRED)
LLM_BASE_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=your-actual-api-key-here
LLM_MODEL_NAME=gpt-4-turbo-preview
LLM_TEMPERATURE=0

# Application Limits (OPTIONAL - defaults shown)
MAX_HORIZON_STEPS=2000
MAX_ROWS_PER_SENSOR=100000
MAX_FILE_SIZE_MB=10

# Logging (OPTIONAL)
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true
```

**Getting an OpenAI API Key**:
1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create new secret key
5. Copy and paste into `.env.local`

**Alternative LLM Providers**:
- **Azure OpenAI**: Use your Azure endpoint URL
- **Anthropic Claude**: Use Anthropic API endpoint
- **Local Model**: Point to local inference server
- **Any OpenAI-compatible API**: Update URL and model name

### 5. Verify Installation

Run the build command to verify everything is set up correctly:

```bash
npm run build
```

**Expected output**:
```
▲ Next.js 14.0.4

Creating an optimized production build ...
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (4/4)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         92 kB
├ ○ /forecast                            8.1 kB         95 kB
└ ƒ /api/forecast                        0 B            0 B
└ ƒ /api/profile                         0 B            0 B
```

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

**Expected output**:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.5s
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Development features**:
- Hot module replacement (instant updates)
- Detailed error messages
- Source maps for debugging

### Production Mode (Local)

Build and run production version:

```bash
npm run build
npm start
```

**Production features**:
- Optimized bundle
- Faster page loads
- Minified code

## Verification Checklist

After installation, verify:

### ✅ Basic Functionality

1. **Application loads**
   - Visit http://localhost:3000
   - Homepage displays without errors

2. **File upload works**
   - Upload `/public/samples/temperature-10s.csv`
   - No parsing errors

3. **Data profiling succeeds**
   - Statistics display correctly
   - Frequency detected as "10s"
   - Preview shows first rows

4. **Forecast generates**
   - Click "Generate Forecast"
   - Chart renders with history + forecast
   - No API errors

5. **Downloads work**
   - Click "Download Forecast CSV"
   - Click "Download Run Config"
   - Files download successfully

### ✅ Environment Variables

Check that environment variables are loaded:

```bash
# From project root
node -e "console.log(process.env.LLM_MODEL_NAME)"
```

Should not return "undefined".

### ✅ TypeScript

Check for TypeScript errors:

```bash
npm run build
```

Should complete with "✓ Compiled successfully"

### ✅ Network

Verify LLM API is reachable:

```bash
curl -X POST $LLM_BASE_URL \
  -H "Authorization: Bearer $LLM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4","messages":[{"role":"user","content":"test"}],"max_tokens":5}'
```

Should return JSON response (not error).

## Troubleshooting Installation

### Issue: `npm install` fails

**Error**: "EACCES: permission denied"

**Solution**:
```bash
# Don't use sudo! Fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Then retry
npm install
```

---

**Error**: "Cannot find module"

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

**Error**: "Unsupported engine"

**Solution**: Upgrade Node.js to 18.17.0 or higher
```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### Issue: Environment variables not loading

**Symptoms**: "LLM configuration missing" error

**Solution**:
```bash
# Verify file exists
ls -la .env.local

# Check contents (macOS/Linux)
cat .env.local

# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

**Important**:
- File must be named `.env.local` (not `.env.local.txt`)
- Must be in project root directory
- No spaces around `=` in variable assignments
- Restart server after changing environment variables

### Issue: Port 3000 already in use

**Error**: "Port 3000 is already in use"

**Solution**:
```bash
# Option 1: Use different port
PORT=3001 npm run dev

# Option 2: Kill process using port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Option 3: Kill process (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Build fails with TypeScript errors

**Error**: Type errors during build

**Solution**:
```bash
# Check TypeScript version
npm list typescript

# Reinstall TypeScript
npm install --save-dev typescript@latest

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### Issue: Hot reload not working

**Symptoms**: Changes don't appear in browser

**Solution**:
```bash
# Stop server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Restart
npm run dev

# Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
```

### Issue: CSV upload fails

**Error**: "Failed to parse CSV"

**Solution**:
- Verify CSV has headers: `timestamp,value`
- Check timestamp format (ISO8601, epoch seconds, or epoch ms)
- Ensure values are numeric
- No extra commas or quotes
- File encoding is UTF-8

**Test with sample**:
```bash
cat public/samples/temperature-10s.csv
```

### Issue: Forecast API fails

**Error**: "LLM returned invalid response"

**Possible causes**:
1. **API key invalid**: Check `.env.local`
2. **Model not available**: Try different model name
3. **Rate limit exceeded**: Wait and retry
4. **Network issue**: Check internet connection

**Debug**:
```bash
# Check logs in terminal
# Look for detailed error messages

# Test API key manually
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $LLM_API_KEY"
```

## Performance Optimization

### Development Mode
```bash
# Faster rebuilds
export NEXT_PRIVATE_DISABLE_ESLINT=1

# Skip type checking during dev
# (still runs on build)
```

### Production Build
```bash
# Analyze bundle size
npm run build

# Output shows size of each route
# Optimize large bundles if needed
```

## IDE Setup (Optional)

### VS Code

Recommended extensions:
```bash
# Install via VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
```

Settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### WebStorm / IntelliJ

1. Enable TypeScript support (auto-detected)
2. Enable Tailwind CSS IntelliSense
3. Set Prettier as code formatter

## Updating Dependencies

Check for updates:
```bash
npm outdated
```

Update all dependencies:
```bash
npm update
```

Update specific package:
```bash
npm install package-name@latest
```

## Uninstallation

To remove the project:
```bash
# Remove node_modules
rm -rf node_modules

# Remove build artifacts
rm -rf .next

# Remove lock file
rm package-lock.json

# (Optional) Remove entire project
cd ..
rm -rf any-horizon-forecaster
```

## Next Steps

After successful installation:

1. **Read Quick Start**: See [QUICKSTART.md](QUICKSTART.md)
2. **Try Sample Data**: Upload files from `/public/samples/`
3. **Read Full Docs**: See [README.md](README.md)
4. **Deploy to Vercel**: See [DEPLOYMENT.md](DEPLOYMENT.md)

## Getting Help

Installation issues?

1. **Check logs**: Read terminal output carefully
2. **Verify requirements**: Node 18+, npm 9+
3. **Clear cache**: `rm -rf node_modules .next`
4. **Fresh install**: `npm install`
5. **Check GitHub**: Search existing issues
6. **Ask for help**: Open new issue with:
   - Operating system
   - Node.js version
   - Error message
   - Steps to reproduce

---

**Installation Complete!** 🎉

You're ready to start forecasting IoT data.

Run `npm run dev` and visit http://localhost:3000
