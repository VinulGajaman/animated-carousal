# 🪐 Galaxy Hero — Animated Web Experience

A visually immersive hero section built with React, featuring orbiting silver cards, a space-travel warp effect, and a liquid glass card reveal. Designed to show what a premium, creative website can feel like.

> **Seen on TikTok?** Drop a comment and I'll share the repo link 👇  
> **Want this for your brand?** → [stefan@codinglegends.io](mailto:stefan@codinglegends.io)

---

## ✦ Features

- **3D Orbiting Cards** — Social media icon cards orbit a central hand in full 3D perspective with mouse-tilt spring physics and drag interaction
- **Silver Galaxy Starfield** — 320 twinkling stars with iridescent shimmer, silver gleam crosses, and subtle nebula clouds rendered on canvas
- **Space Warp on Click** — Stars accelerate outward (fly in) or rush inward (fly back) with streak tails for a true space-travel tunnel effect
- **Liquid Glass Card** — Dark glassmorphism reveal card with chrome gradient text, animated icon, and a one-shot silver shimmer sweep
- **Dark Chrome Cards** — Silver Surfer–style metallic cards with sharp specular highlights, knife-edge shine animation, and directional lighting borders
- **Loading Screen** — Startup screen with a silver 4-point star logo, sweeping chrome progress ring, and comet head that traces the arc
- **Figtree Typography** — Clean geometric sans-serif throughout

---

## 🛠 Tech Stack

| Tool | Version |
|------|---------|
| React | 18 |
| Vite | 6 |
| Framer Motion | 11 |
| React Icons | 5 |
| Figtree (Google Fonts) | — |

> Three.js / R3F are in the dependencies but the current build uses pure Canvas 2D and CSS 3D transforms for the orbit — no WebGL required.

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/animated-web.git
cd animated-web

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## 📁 Project Structure

```
animated-web/
├── public/
│   └── hand3.png           # Hand image (replace with your own)
├── src/
│   ├── components/
│   │   ├── HeroSection.jsx  # Main scene — orbit, starfield, warp, glass card
│   │   └── LoadingScreen.jsx# Startup animation
│   ├── App.jsx
│   ├── index.css            # Global styles, card chrome theme
│   └── main.jsx
├── index.html
└── package.json
```

---

## 🎨 Customisation

**Swap the hand image**
Drop your own PNG into `/public/` and update `HAND_SRC` in `HeroSection.jsx`.

**Change card icons**
Edit `CARDS_DATA` in `HeroSection.jsx` — any icon from `react-icons` works.

**Change card descriptions**
Edit the `DESCRIPTIONS` object in `HeroSection.jsx`.

**Adjust orbit speed**
Change `velocity.current = 0.12` (higher = faster).

**Adjust warp duration**
Change the `1200` timeout in `onCardClick` and `handleClose` (milliseconds).

---

## 💼 Work With Me

I build premium, creative websites that stand out.  
If you want something like this — or better — for your brand:

📩 **[stefan@codinglegends.io](mailto:stefan@codinglegends.io)**

---

## 📄 License

MIT — free to use, modify, and build on. A credit or shoutout is always appreciated. 🙌
