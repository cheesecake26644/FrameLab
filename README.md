# FrameLab — Free animation and video creation tools

A responsive static website with five working tools and three original field guides. No server, install step, account, API token or build process is required.

## Run locally

Open `index.html` in a browser or use `python3 -m http.server 8000` from this directory, then navigate to http://localhost:8000.

## Publishing for free

Upload the contents of this directory to a GitHub repository. In that repository, select **Settings → Pages → Deploy from a branch**, choose your publishing branch and `/ (root)`, then save. GitHub Pages can serve the HTML/CSS/JS files directly.

Make sure your actual contact email is added in `assets/site-config.js`. Replace branding/content if you prefer. Supply a real public domain in `siteUrl` when known.

## Ads: inactive until approval

This website does not currently display live advertisements or earn revenue. Google AdSense requires a site review, original content and an approved publisher account. Applicants must be at least 18; for someone younger, a parent/guardian can apply with their own account and receive any payments. Do not fake an age or account holder.

After approval only:
1. Update contact and privacy details. Verify local advertising and consent requirements, especially for EEA/UK traffic.
2. Enter the **approved** publisher ID and ad unit IDs in `assets/site-config.js`.
3. Set `adsEnabled: true` only after all policies and consent requirements are met.
4. Add an `ads.txt` file **only with the actual account's authorized seller declaration** supplied by the ad network.
5. Confirm ads load and that your site remains usable. Do not click your own ads or encourage others to do so.

## Content and tools
- Frame/timecode calculator: non-drop-frame convention; actual duration shown separately for fractional rates.
- Walk-cycle pose planner: evenly spaced suggested poses with CSV export.
- Shot list: local storage only; CSV export.
- Aspect crop: centered crop rectangle and percentage removed.
- Render-time estimator: simple mean cost × frames ÷ workers.
- Three original guides.

## Limitations
No monetization revenue is guaranteed. No production analytics or consent system is enabled by default. Recheck site content, privacy obligations, ad platform requirements, accessibility, security and performance before public launch.
