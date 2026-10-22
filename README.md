# United Students of America

A complete static website for our AP Government interest group project.
Created for Ira, Nikita, Tulsi, and Jordan.

## Put it on GitHub

1. Extract this ZIP.
2. Create a GitHub repository (a public repository is the simplest option for free GitHub Pages hosting).
3. Upload everything **inside** the `united-students-of-america` folder to the repository. Keep `index.html` at the repository root, alongside the other HTML, CSS, JavaScript files, and `assets` folder.
4. Commit the uploaded files.

## Publish with GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/(root)**, then save.
4. When deployment completes, GitHub displays your website link in Pages settings.

The included `.nojekyll` file tells GitHub Pages to serve these files directly. No npm installation, build step, API key, or database is needed.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Preview on your computer

Open `index.html` in a browser, or use VS Code's Live Server extension.
If Python is installed, run this from the extracted folder:

```sh
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Edit the website

- Each `.html` file is a complete page; edit its text directly.
- `chapters.css` contains the latest typography, page layout, responsive styles, and character animations. It extends `styles.css`, `playful.css`, and `fieldguide.css`.
- `app.js` controls chapter navigation, event dialogs, sharing, and the editable letter builder.
- `playful.js` controls motion, the book mascot, confetti, and the campus game.
- `assets/` contains local fonts and vector illustrations. Keep the folder with the website. Font licensing is included in `assets/FONT-LICENSE.txt`.
- Shared headers, footers, and menus appear in each HTML file. Update them across the pages when changing navigation.

## Pages

| File | Section |
| --- | --- |
| index.html | Introduction |
| our-cause.html | Our cause |
| research.html | Examples and research |
| why-it-matters.html | Why it matters |
| fundraising.html | Fundraising plan |
| stand-out.html | How we stand out |
| action-1.html | Taking action, Part 1 |
| action-2.html | Taking action, Part 2: government involvement and letters |
| action-3.html | Taking action, Part 3 |
| connect.html | Learn more and connect |
| dream-campus.html | Campus funding game |

Research sources are linked on the pages. Events, social accounts, surveys, and petitions are proposed activities. The letter builder does not submit messages or collect personal information. The Share button automatically uses your new website address when hosted.

This export contains the ready-to-edit HTML, CSS, JavaScript, and assets from the completed website. It excludes hosting account configuration, Git history, and preview screenshots.
