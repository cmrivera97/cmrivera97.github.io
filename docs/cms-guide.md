# Editing the portfolio with Pages CMS

This site's content (projects + categories) is edited through **Pages CMS**, a
free browser-based editor. Saving in the CMS commits to the repository and the
live site rebuilds automatically.

## One-time setup (for the editor)

1. Create a free GitHub account (if you don't have one).
2. Ask the repo owner to invite you as a **collaborator** on
   `portfolio-web-app-ciruela` and accept the email invite.
3. Go to https://app.pagescms.org and sign in with GitHub.
4. Authorize the **Pages CMS GitHub App** for the repository when prompted.
5. Open the repository in Pages CMS — you'll see **Projects** and **Categories**.

## Editing content

- **Projects** and **Categories** are browsable as folder trees (by kind, then
  category). Click an entry to edit it.
- Every text field has **English** and **Español** boxes — fill both.
- **Cover image:** optional. If you leave it empty, the site shows a colored
  placeholder. Upload an image to replace it.
- **Gallery:** add items; each is a file (image or `.mp4`), an alt text
  (EN/ES), and a type (image/video).
- Click **Save** — this commits your change. The live site updates within a few
  minutes once the build finishes.

## What is NOT in the CMS

- Site-wide copy (hero tagline, contact text, nav labels) is managed in code.
  Ask the repo owner to change these.
- Hero background videos are managed manually (optimized + tracked separately).

## Image guidance (important)

- **Optimize before uploading**: export web-sized images (long edge ~2000px,
  JPG/WebP). The CMS does not compress for you.
- **Metadata is not stripped automatically.** Photo files can carry EXIF/IPTC
  data (camera, location). If that matters, strip metadata before uploading.

## How content moved into the CMS

The existing projects/categories were already stored as JSON in the repo, so
they appear in the CMS automatically — no manual re-entry. The only change was
removing developer placeholder tokens from cover fields; covers now start empty
and show a generated placeholder until you upload a real image.
