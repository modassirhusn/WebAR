# 🚀 Deployment Guide - WebAR Experience

This guide walks you through deploying your WebAR application to production with HTTPS enabled.

## Prerequisites

- ✅ Completed WebAR project files
- ✅ Git installed (for version control)
- ✅ Node.js installed (for CLI tools)
- ✅ Mobile device for testing

---

## Option 1: Deploy to Vercel (Recommended) ⭐

Vercel provides automatic HTTPS, global CDN, and instant deployments.

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate via email or GitHub.

### Step 3: Deploy

Navigate to your project directory:

```bash
cd c:/Users/mdmod/OneDrive/Desktop/WebAR
vercel --prod
```

### Step 4: Configuration

Vercel will ask:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → webar-experience (or your choice)
- **Directory?** → `./` (current directory)
- **Override settings?** → No

### Step 5: Get Your URL

After deployment completes, Vercel will provide:
```
✅ Production: https://webar-experience.vercel.app
```

### Step 6: Test on Mobile

1. Open the URL on your mobile device
2. Grant camera permissions
3. Test AR functionality

### Vercel Dashboard

Visit [vercel.com/dashboard](https://vercel.com/dashboard) to:
- View deployment logs
- Configure custom domains
- Monitor analytics
- Manage environment variables

---

## Option 2: Deploy to Netlify

Netlify offers similar features with drag-and-drop deployment.

### Method A: Netlify CLI

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Login

```bash
netlify login
```

#### Step 3: Deploy

```bash
cd c:/Users/mdmod/OneDrive/Desktop/WebAR
netlify deploy --prod
```

Follow the prompts:
- **Create new site?** → Yes
- **Team?** → Your team
- **Site name?** → webar-experience
- **Publish directory?** → `.` (current directory)

#### Step 4: Get Your URL

```
✅ Live URL: https://webar-experience.netlify.app
```

### Method B: Netlify Drop (No CLI)

1. Visit [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop your entire `WebAR` folder
3. Wait for deployment (30-60 seconds)
4. Get your live URL!

**Pros**: No command line needed
**Cons**: Manual updates required

---

## Option 3: Deploy to GitHub Pages

Free hosting with custom domain support.

### Step 1: Create GitHub Repository

```bash
cd c:/Users/mdmod/OneDrive/Desktop/WebAR
git init
git add .
git commit -m "Initial WebAR project"
```

### Step 2: Push to GitHub

Create a new repository on [github.com](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/webar-experience.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Source: **Deploy from branch**
3. Branch: **main** → Folder: **/ (root)**
4. Click **Save**

### Step 4: Wait for Deployment

GitHub will build and deploy (2-5 minutes). Your site will be at:
```
https://YOUR_USERNAME.github.io/webar-experience
```

### Step 5: Enable HTTPS

GitHub Pages automatically provides HTTPS. Ensure "Enforce HTTPS" is checked in Settings → Pages.

---

## Option 4: Deploy to Firebase Hosting

Google's hosting platform with excellent global CDN.

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login

```bash
firebase login
```

### Step 3: Initialize Project

```bash
cd c:/Users/mdmod/OneDrive/Desktop/WebAR
firebase init hosting
```

Configuration:
- **Use existing project or create new?** → Create new project
- **Project name?** → webar-experience
- **Public directory?** → `.` (current directory)
- **Single-page app?** → No
- **Overwrite index.html?** → No

### Step 4: Deploy

```bash
firebase deploy --only hosting
```

### Step 5: Get Your URL

```
✅ Hosting URL: https://webar-experience.web.app
```

---

## Custom Domain Setup

### Vercel Custom Domain

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Domains**
4. Add your custom domain (e.g., `ar.yourdomain.com`)
5. Update DNS records as instructed
6. Wait for SSL certificate (automatic)

### Netlify Custom Domain

1. Go to [app.netlify.com](https://app.netlify.com)
2. Select your site
3. **Domain settings** → **Add custom domain**
4. Follow DNS configuration instructions
5. Enable HTTPS (automatic with Let's Encrypt)

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] **HTTPS is enabled** (check for 🔒 in browser)
- [ ] **All assets load** (no 404 errors in console)
- [ ] **Camera permission works** on mobile
- [ ] **3D model loads** successfully
- [ ] **Touch gestures work** (move, rotate, scale)
- [ ] **Error handling works** (try on unsupported browser)
- [ ] **Performance is acceptable** (30+ FPS)

---

## Testing on Mobile Devices

### iOS Testing (Safari)

1. Open Safari on iPhone/iPad (iOS 15.4+)
2. Navigate to your deployed URL
3. Tap "Enable Camera" when prompted
4. Test AR functionality

**Common Issues:**
- **Camera not working?** → Check Settings → Safari → Camera
- **AR not starting?** → Ensure iOS 15.4+ and Safari (not Chrome)
- **Model not appearing?** → Check console for errors

### Android Testing (Chrome)

1. Open Chrome on Android device
2. Navigate to your deployed URL
3. Grant camera permission
4. Test AR functionality

**Common Issues:**
- **WebXR not supported?** → Update Chrome to latest version
- **Camera permission denied?** → Settings → Apps → Chrome → Permissions
- **Performance issues?** → Try on a more powerful device

---

## Monitoring & Analytics

### Add Google Analytics (Optional)

Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Track AR Events

Add to `app.js`:

```javascript
// Track AR session start
function startARExperience() {
    // ... existing code ...
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'ar_session_start', {
            'event_category': 'AR',
            'event_label': 'Session Started'
        });
    }
}
```

---

## Updating Your Deployment

### Vercel

```bash
# Make changes to your code
git add .
git commit -m "Update AR experience"

# Redeploy
vercel --prod
```

### Netlify

```bash
# Make changes
git add .
git commit -m "Update AR experience"

# Redeploy
netlify deploy --prod
```

### GitHub Pages

```bash
# Make changes
git add .
git commit -m "Update AR experience"
git push origin main

# GitHub automatically redeploys
```

---

## Troubleshooting Deployment

### Issue: "HTTPS Required"

**Solution**: All deployment platforms provide automatic HTTPS. If you see this error:
1. Ensure you're accessing via `https://` not `http://`
2. Check deployment platform settings
3. Wait for SSL certificate provisioning (can take 5-10 minutes)

### Issue: "404 Not Found"

**Solution**:
1. Check that `index.html` is in the root directory
2. Verify deployment configuration (public directory)
3. Check deployment logs for errors

### Issue: "Model Not Loading"

**Solution**:
1. Verify model path is correct (`./models/model.glb`)
2. Check CORS headers (should be automatic on hosting platforms)
3. Ensure model file was uploaded
4. Check browser console for specific errors

### Issue: "Camera Permission Not Working"

**Solution**:
1. **Must use HTTPS** (camera requires secure context)
2. Test on actual mobile device (not desktop)
3. Check browser compatibility (iOS 15.4+, Chrome 79+)
4. Clear browser cache and try again

---

## Performance Optimization

### Enable Compression

Most platforms enable gzip/brotli automatically. Verify:

```bash
# Check response headers
curl -I https://your-site.vercel.app
```

Look for:
```
Content-Encoding: gzip
```

### CDN Configuration

Vercel and Netlify provide global CDN automatically. For optimal performance:

1. **Minimize file sizes** (compress images, models)
2. **Use caching headers** (already configured in `vercel.json` / `netlify.toml`)
3. **Lazy load assets** (already implemented in `app.js`)

---

## Security Best Practices

### Content Security Policy (Optional)

Add to `index.html` `<head>`:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://aframe.io https://unpkg.com https://raw.githack.com; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https:;">
```

### HTTPS Enforcement

Already configured in `vercel.json` and `netlify.toml`.

### Camera Permissions

The app only requests camera access when user explicitly grants permission (best practice).

---

## Next Steps

After successful deployment:

1. ✅ Generate QR code (see `QR_CODE_GUIDE.md`)
2. ✅ Test on multiple devices
3. ✅ Share with users/clients
4. ✅ Monitor analytics
5. ✅ Gather feedback
6. ✅ Iterate and improve

---

## Support

If you encounter issues:

1. Check deployment platform documentation
2. Review browser console for errors
3. Test on different devices
4. Verify HTTPS is enabled
5. Check compatibility matrix in README.md

---

**🎉 Congratulations! Your WebAR experience is now live!**

Next: [Generate QR Code →](QR_CODE_GUIDE.md)
