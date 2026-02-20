# Varun Meda — Portfolio

Personal portfolio site. Pure HTML + CSS + JS, no build step, GitHub Pages ready.

## Local Preview

```bash
cd portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. **Create the repo** `VMaroon95.github.io` on GitHub (public, no template).

2. **Push:**
   ```bash
   cd portfolio
   git init
   git add -A
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin git@github.com:VMaroon95/VMaroon95.github.io.git
   git push -u origin main
   ```

3. **Enable Pages:** Repo → Settings → Pages → Source: `main` / `/ (root)` → Save.

4. Site goes live at **https://vmaroon95.github.io** within ~1 min.

## Customization

- **Theme colors:** Edit CSS variables at top of `css/style.css`
- **Add a project:** Copy the `<!-- PROJECT CARD -->` block in `index.html`
- **Add a timeline entry:** Copy the `<!-- TIMELINE ENTRY -->` block
- **Links:** Update LinkedIn URL and email in the hero and contact sections
