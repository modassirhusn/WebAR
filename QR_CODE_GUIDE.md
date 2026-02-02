# 📱 QR Code Generation Guide

Generate QR codes for instant access to your WebAR experience.

## Why QR Codes?

QR codes provide the fastest way for users to access your AR experience:
- **Instant Access**: Scan → AR launches
- **No Typing**: No need to manually enter URLs
- **Print Friendly**: Works on posters, business cards, packaging
- **Trackable**: Can include analytics parameters

---

## Quick Start

### Online QR Code Generators (Easiest)

#### 1. QR Code Generator
**URL**: [qr-code-generator.com](https://www.qr-code-generator.com/)

Steps:
1. Select "URL" type
2. Enter your deployed URL: `https://your-site.vercel.app`
3. Customize design (optional):
   - Add logo
   - Change colors
   - Adjust size
4. Download as PNG or SVG

**Pros**: Free, customizable, high quality
**Cons**: Watermark on free tier

#### 2. QRCode Monkey
**URL**: [qrcode-monkey.com](https://www.qrcode-monkey.com/)

Steps:
1. Enter your URL
2. Customize:
   - Colors
   - Logo (upload your brand)
   - Design pattern
3. Download (PNG, SVG, PDF, EPS)

**Pros**: No watermark, fully customizable
**Cons**: None

#### 3. Canva QR Code
**URL**: [canva.com/qr-code-generator](https://www.canva.com/qr-code-generator/)

Steps:
1. Enter URL
2. Generate QR code
3. Customize in Canva editor
4. Download or share

**Pros**: Integrates with Canva designs
**Cons**: Requires Canva account

---

## Advanced: Command Line Generation

### Using Node.js

#### Install QRCode Package

```bash
npm install -g qrcode
```

#### Generate QR Code

```bash
# PNG format
qrcode "https://your-site.vercel.app" -o qrcode.png

# With custom size
qrcode "https://your-site.vercel.app" -o qrcode.png -w 500

# SVG format (scalable)
qrcode "https://your-site.vercel.app" -o qrcode.svg -t svg

# Terminal output (for testing)
qrcode "https://your-site.vercel.app"
```

#### Batch Generation

Create `generate-qr.js`:

```javascript
const QRCode = require('qrcode');

const urls = [
    { name: 'production', url: 'https://webar-experience.vercel.app' },
    { name: 'staging', url: 'https://webar-staging.vercel.app' },
];

urls.forEach(({ name, url }) => {
    QRCode.toFile(`qr-${name}.png`, url, {
        width: 500,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    }, (err) => {
        if (err) throw err;
        console.log(`✅ Generated qr-${name}.png`);
    });
});
```

Run:
```bash
node generate-qr.js
```

### Using Python

```python
import qrcode

# Create QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)

qr.add_data('https://your-site.vercel.app')
qr.make(fit=True)

# Create image
img = qr.make_image(fill_color="black", back_color="white")
img.save("qrcode.png")

print("✅ QR code generated!")
```

---

## Customization Options

### Size Recommendations

| Use Case | Recommended Size | Format |
|----------|-----------------|--------|
| **Business Card** | 1-2 cm | PNG/SVG |
| **Poster** | 5-10 cm | SVG (scalable) |
| **Website** | 200-300 px | PNG/SVG |
| **Print Media** | 300 DPI | PDF/EPS |
| **Digital Display** | 500-1000 px | PNG |

### Error Correction Levels

Higher error correction = more damage tolerance but larger QR code.

| Level | Recovery | Best For |
|-------|----------|----------|
| **L** | ~7% | Digital displays |
| **M** | ~15% | General use |
| **Q** | ~25% | Outdoor posters |
| **H** | ~30% | With logo overlay |

### Color Considerations

**Best Practices:**
- **High Contrast**: Dark on light background
- **Avoid**: Light colors (yellow, light blue)
- **Safe**: Black on white (most reliable)
- **Branding**: Use brand colors but test thoroughly

**Testing:**
```
✅ Good: Black on white
✅ Good: Dark blue on white
⚠️ Caution: Red on white (test on multiple scanners)
❌ Bad: Yellow on white (low contrast)
❌ Bad: White on black (some scanners struggle)
```

---

## Adding Your Logo

### Online Tools

Most online generators allow logo upload:
1. Generate base QR code
2. Upload logo (PNG with transparency)
3. Adjust logo size (10-30% of QR code)
4. Download

### Programmatically (Node.js)

```javascript
const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');

async function generateQRWithLogo(url, logoPath, outputPath) {
    // Generate QR code
    const qrCanvas = createCanvas(500, 500);
    await QRCode.toCanvas(qrCanvas, url, {
        width: 500,
        margin: 2,
        errorCorrectionLevel: 'H'
    });

    const ctx = qrCanvas.getContext('2d');
    
    // Load and draw logo
    const logo = await loadImage(logoPath);
    const logoSize = 100;
    const logoX = (500 - logoSize) / 2;
    const logoY = (500 - logoSize) / 2;
    
    // White background for logo
    ctx.fillStyle = 'white';
    ctx.fillRect(logoX - 10, logoY - 10, logoSize + 20, logoSize + 20);
    
    // Draw logo
    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    
    // Save
    const fs = require('fs');
    const buffer = qrCanvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`✅ QR code with logo saved to ${outputPath}`);
}

generateQRWithLogo(
    'https://your-site.vercel.app',
    './assets/logo.png',
    'qr-with-logo.png'
);
```

---

## Analytics & Tracking

### Add UTM Parameters

Track QR code scans with analytics:

```
https://your-site.vercel.app?utm_source=qr&utm_medium=poster&utm_campaign=launch
```

**Parameters:**
- `utm_source`: Where QR is placed (qr, print, digital)
- `utm_medium`: Type of placement (poster, card, flyer)
- `utm_campaign`: Campaign name (launch, event, promo)

**Example QR Codes:**

```bash
# Poster QR
qrcode "https://your-site.vercel.app?utm_source=qr&utm_medium=poster&utm_campaign=launch" -o qr-poster.png

# Business Card QR
qrcode "https://your-site.vercel.app?utm_source=qr&utm_medium=card&utm_campaign=networking" -o qr-card.png

# Event Booth QR
qrcode "https://your-site.vercel.app?utm_source=qr&utm_medium=booth&utm_campaign=tech_expo" -o qr-booth.png
```

### URL Shorteners

For cleaner QR codes and tracking:

#### Bitly
```bash
# Create short URL at bit.ly
# Then generate QR:
qrcode "https://bit.ly/your-webar" -o qrcode.png
```

**Benefits:**
- Shorter URL = simpler QR code
- Built-in analytics
- Editable destination URL

#### TinyURL
```bash
qrcode "https://tinyurl.com/your-webar" -o qrcode.png
```

---

## Testing Your QR Code

### Before Printing

1. **Test on Multiple Devices**
   - iPhone (Camera app)
   - Android (Camera app or Google Lens)
   - QR scanner apps

2. **Test at Different Sizes**
   - Print at intended size
   - Scan from various distances
   - Ensure minimum size (2×2 cm)

3. **Test in Different Lighting**
   - Indoor lighting
   - Outdoor sunlight
   - Low light conditions

4. **Test with Damage**
   - Slightly crumple paper
   - Add small marks
   - Verify error correction works

### Checklist

- [ ] QR code scans successfully
- [ ] Opens correct URL
- [ ] Works on iOS and Android
- [ ] Readable at intended distance
- [ ] High enough contrast
- [ ] Error correction adequate
- [ ] Analytics tracking works (if enabled)

---

## Distribution Ideas

### Physical

1. **Business Cards**
   - Back of card
   - 2×2 cm minimum
   - High quality print

2. **Posters**
   - Bottom corner
   - 5-10 cm size
   - "Scan to experience AR" CTA

3. **Product Packaging**
   - Include on box
   - Link to AR product demo
   - Enhance unboxing experience

4. **Flyers & Brochures**
   - Prominent placement
   - Clear call-to-action
   - High contrast printing

5. **Trade Show Booths**
   - Large format (A4 size)
   - Eye-level placement
   - Demo instructions nearby

### Digital

1. **Email Signatures**
   - Small QR code image
   - Links to AR portfolio

2. **Social Media**
   - Instagram posts/stories
   - LinkedIn profile
   - Twitter bio

3. **Website**
   - "Try AR" section
   - Mobile-optimized placement
   - Hover for instructions

4. **Presentations**
   - Last slide
   - "Try it now" CTA
   - Conference talks

---

## Design Templates

### Poster Template

```
┌─────────────────────────────────┐
│                                 │
│     EXPERIENCE AR               │
│     IN YOUR BROWSER             │
│                                 │
│     ┌─────────────┐             │
│     │             │             │
│     │   QR CODE   │             │
│     │             │             │
│     └─────────────┘             │
│                                 │
│   Scan to launch AR             │
│   No app required               │
│                                 │
└─────────────────────────────────┘
```

### Business Card Template

```
┌──────────────────────────────┐
│  Your Name                   │
│  WebAR Developer             │
│                              │
│  email@example.com           │
│  yourwebsite.com             │
│                              │
│              ┌────────┐      │
│              │ QR     │      │
│              │ CODE   │      │
│              └────────┘      │
│              Try My AR       │
└──────────────────────────────┘
```

---

## Downloadable Resources

### Pre-made Templates

Create a `qr-templates/` folder with:

```
qr-templates/
├── poster-template.psd        # Photoshop
├── poster-template.ai         # Illustrator
├── card-template.psd          # Business card
├── social-media-template.png  # Instagram/Facebook
└── README.md                  # Usage instructions
```

### Canva Templates

1. Go to [canva.com](https://www.canva.com)
2. Search "QR code poster"
3. Customize with your QR code
4. Download and print

---

## Best Practices Summary

✅ **DO:**
- Use high contrast (black on white)
- Test before mass printing
- Include clear call-to-action
- Use error correction level H if adding logo
- Test on multiple devices
- Print at adequate size (minimum 2×2 cm)

❌ **DON'T:**
- Use low contrast colors
- Make QR code too small
- Skip testing phase
- Use low-resolution images
- Forget to add instructions

---

## Troubleshooting

### QR Code Won't Scan

**Solutions:**
1. Increase size
2. Improve contrast
3. Reduce logo size
4. Increase error correction
5. Ensure proper printing quality

### Wrong URL Opens

**Solutions:**
1. Verify URL in generator
2. Test QR code before printing
3. Check for typos
4. Regenerate if needed

### Slow to Scan

**Solutions:**
1. Simplify URL (use shortener)
2. Reduce error correction
3. Increase QR code size
4. Improve lighting

---

## Next Steps

After generating your QR code:

1. ✅ Test thoroughly
2. ✅ Print test version
3. ✅ Distribute strategically
4. ✅ Monitor analytics
5. ✅ Gather user feedback

---

**🎉 Your QR code is ready! Start sharing your WebAR experience!**

[← Back to Deployment Guide](DEPLOYMENT_GUIDE.md) | [View README →](README.md)
