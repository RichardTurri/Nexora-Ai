# Nexora AI - Deployment Guide

This guide shows how to deploy the Nexora AI landing page for **free** on various platforms. No ongoing costs, no Polsia tokens needed.

---

## Quick Start (GitHub Pages - Recommended)

### 1. Create a GitHub Repository
```bash
# In the nexora-ai folder
git init
git add .
git commit -m "Initial commit: Nexora AI landing page"
```

### 2. Push to GitHub
```bash
# Create repo on github.com first, then:
git remote add origin https://github.com/SEU_USUARIO/nexora-ai.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repo on GitHub
2. Settings → Pages (left sidebar)
3. Source: "Deploy from a branch"
4. Branch: `main` / `/ (root)`
5. Save

**Your site will be live at:** `https://SEU_USUARIO.github.io/nexora-ai/`

### 4. Custom Domain (Optional)
1. In repo Settings → Pages → Custom domain
2. Add your domain (e.g., `nexora.ai`)
3. Add CNAME record in your DNS:
   ```
   Type: CNAME
   Name: www (or @ for apex)
   Value: SEU_USUARIO.github.io
   ```
4. Enable "Enforce HTTPS" after DNS propagates

---

## Alternative: Netlify (Drag & Drop)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `nexora-ai` folder onto the page
3. Done! Get a `*.netlify.app` URL instantly

**Features:**
- Free custom domain
- Form handling (if you add a contact form)
- Auto HTTPS
- Branch previews

**Custom domain:** Site settings → Domain management → Add custom domain

---

## Alternative: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# In nexora-ai folder
vercel

# Follow prompts, choose "Existing project" or create new
```

**Features:**
- Git integration (auto-deploy on push)
- Free custom domain
- Edge network
- Analytics (optional)

---

## Alternative: Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Pages
2. "Create a project" → Connect to Git
3. Select your GitHub repo
4. Build settings:
   - Build command: (leave empty)
   - Output directory: `/` (root)
5. Deploy!

**Features:**
- Unlimited bandwidth
- Free custom domain
- Free DDoS protection
- Edge functions (if needed later)

---

## Local Development

### Option 1: VS Code Live Server (Easiest)
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

### Option 2: Python
```bash
cd nexora-ai
python -m http.server 8000
# Open http://localhost:8000
```

### Option 3: Node.js (http-server)
```bash
npx http-server nexora-ai -p 8000
```

---

## File Structure
```
nexora-ai/
├── index.html      # Main HTML (entry point)
├── styles.css      # All styles
├── script.js       # Interactions & animations
├── DEPLOY.md       # This file
└── README.md       # Project info (optional)
```

---

## Customization Checklist

Before deploying, update these in `index.html`:

- [ ] **Email addresses**: Change `demo@nexora.ai` and `contato@nexora.ai` to your real emails
- [ ] **Company name**: Update "Nexora AI" if different
- [ ] **Pricing**: Adjust CAD prices if needed
- [ ] **Features**: Modify feature list to match your actual offering
- [ ] **Analytics**: Add Google Analytics / Plausible / Umami if desired
- [ ] **Favicon**: Add `favicon.ico` and `apple-touch-icon.png` to root

---

## Adding Analytics (Optional)

### Plausible (Privacy-friendly, paid but affordable)
```html
<!-- Add to <head> in index.html -->
<script defer data-domain="seu-dominio.com" src="https://plausible.io/js/script.js"></script>
```

### Google Analytics (Free)
```html
<!-- Add to <head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Umami (Free, self-hosted or cloud)
```html
<!-- Add to <head> in index.html -->
<script defer src="https://cloud.umami.is/script.js" data-website-id="YOUR_ID"></script>
```

---

## Performance Tips

1. **Images**: Currently using inline SVGs (optimal). If adding photos:
   - Use WebP format
   - Add `loading="lazy"` to images below fold
   - Compress with TinyPNG/Squoosh

2. **Fonts**: Currently using Google Fonts (Inter). For best performance:
   - Self-host fonts (download Inter, add `@font-face`)
   - Or use `preload` for Google Fonts:
   ```html
   <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
   ```

3. **Cache headers** (Netlify/Vercel/Cloudflare handle automatically)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Styles not loading | Check file paths are relative (`styles.css`, not `/styles.css`) |
| JS errors | Open DevTools Console, check for errors |
| Mobile menu not working | Ensure `script.js` loads after HTML (it does - at end of body) |
| Custom domain not working | Wait 24-48h for DNS, check CNAME/A records |
| GitHub Pages 404 | Ensure repo is public, or upgrade to Pro for private repo Pages |

---

## Costs Summary

| Platform | Cost | Custom Domain | Bandwidth |
|----------|------|---------------|-----------|
| GitHub Pages | Free | Free | 100GB/mo |
| Netlify | Free | Free | 100GB/mo |
| Vercel | Free | Free | 100GB/mo |
| Cloudflare Pages | Free | Free | Unlimited |

**All free tiers are generous for a landing page.**

---

## Next Steps

1. **Deploy** using one of the methods above
2. **Test** on mobile, tablet, desktop
3. **Share** the URL with potential clients
4. **Iterate** based on feedback
5. **Add** a real chat widget later (Intercom, Crisp, Tawk.to, or custom)

---

## Support

If you need help deploying or customizing:
- Check browser DevTools Console for errors
- Verify all file paths are correct
- Ensure HTTPS works (required for service workers, etc.)

The site is pure HTML/CSS/JS - no build step, no dependencies, no lock-in.