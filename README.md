# FrameLab V3

Free, static animation & video tools, with no backend, tracking, login, build step, or subscription.

## Publish from macOS Terminal

1. Download `FrameLab-v3-Refined.zip` into Downloads.
2. Copy the single command from the ChatGPT response.
3. The included `publish.sh` safely clones `cheesecake26644/FrameLab`, updates site files while preserving the existing `assets/site-config.js`, commits, and pushes to `main`. It does **not** force-push or delete other remote files.
4. GitHub must recognise your Git credentials for `git push`. If you see an authentication error, install and sign into GitHub CLI (`gh auth login`) or use your already-configured Git credentials, then rerun the script. Never paste access tokens into chat.

## Site pages

Seven free tools: frame/timecode calculator, reference-video frame sync, animation Curve Lab, walk-cycle planner, shot list with JSON backup and edit support, aspect ratio crop, and render-time estimator. Three original guides.

## Important

Advertising is disabled. Monetization requires approved advertising accounts, relevant disclosures/consent, and genuine traffic. AdSense account holders must be adults; an eligible parent/guardian can register.

The publishing script preserves your existing `assets/site-config.js` if it is already in GitHub. If you have an older version with a blank `siteUrl`, set it to `https://cheesecake26644.github.io/FrameLab/` manually.
