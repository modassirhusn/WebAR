# 🚀 Deployment & QR Code Setup

Your WebAR Menu is ready! To use it on mobile devices with QR codes, follow these steps.

## 1. Requirement: HTTPS for Camera Access
The AR camera feature requires a secure **HTTPS** connection.
- **Localhost (HTTP)**: Will NOT work on mobile (unless using USB debugging).
- **Vercel/Netlify (HTTPS)**: Will work perfectly.

## 2. Deploying to Vercel (Recommended)
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and import your repository.
3. Deploy! Vercel will give you a domain like `https://your-project-name.vercel.app`.

## 3. Generating QR Codes
Once deployed, use your Vercel domain to create QR codes for each hotel.

### Hotel Links
Replace `https://my-ar-menu.vercel.app` with your **actual** Vercel domain:

| Hotel | URL to Encode in QR |
|-------|---------------------|
| **Shubham Bhai's Hotel** | `https://your-project-name.vercel.app/menu/shubham-bhais-hotel` |
| **Sourav Bhai's Hotel** | `https://your-project-name.vercel.app/menu/sourav-bhais-hotel` |
| **Grand Plaza** | `https://your-project-name.vercel.app/menu/grand-plaza` |
| **Seaside Bistro** | `https://your-project-name.vercel.app/menu/seaside-bistro` |

## 4. Testing Locally (Optional)
If you want to test on your phone *before* deploying:
1. Run `npm run dev -- --host` on your computer.
2. Look for the "Network" URL (e.g., `http://192.168.1.5:5173`).
3. Open that URL on your phone (connected to same WiFi).
4. **Note:** Camera might be blocked on HTTP. Use Chrome `chrome://flags/#unsafely-treat-insecure-origin-as-secure` to enable it for your IP if needed.
