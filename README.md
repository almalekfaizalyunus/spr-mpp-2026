# SPR MPP 2026 — GitHub Pages Demo

## Deploy
1. Create a GitHub repository, for example `spr-mpp-2026`.
2. Upload `index.html`, `style.css`, `app.js`, the `admin/` folder, and this README to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**, then save.
6. Wait for GitHub Pages to publish the site.

## Important
- This is a visual demo and uses illustrative sample data (`DEMO_MODE = true` in `app.js`).
- It is not connected to Microsoft Forms, Power Automate, or OneDrive yet.
- Do not place Excel files, voter data, candidate vote totals, API keys, passwords, or Microsoft access tokens in this public repository.
- A public GitHub Pages site cannot safely protect admin data by merely hiding a page or using client-side JavaScript. The admin page is only a wireframe.
- Before live use, create a secure data service that returns aggregate turnout to the public site and requires server-side authentication/authorization for candidate results.

## Official guide
GitHub Pages: https://docs.github.com/en/pages
