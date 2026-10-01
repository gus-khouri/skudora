# skudora.com website

Static HTML site. Every push to `main` deploys straight to the live site over FTPS (`.github/workflows/deploy.yml`). Work on a separate branch unless Gus says to publish.

## Site-wide consistency (Gus's standing rule)

The header bar and footer must be identical on every page, always.

- Header and footer markup is copied into each `.html` file. Any change to one must be made to every page, including pages in subfolders like `vs/`.
- Site-wide styling and effects (like the header underline pulse) go in `css/styles.css`, which every page loads. Never add a site-wide effect to a single page.
- Pages in subfolders use absolute links (`/features.html`, `/css/styles.css`).
- Before committing, run `python3 .github/check-layout.py`. The deploy also runs it and stops if any page's header or footer differs from `index.html`.
- After deploying, load a few live pages to confirm.

## Writing style

- No em dashes in new copy.
- Skudora is a product and trademark of Andket Holding Corp., not a company.
- Spire partner status wording: "Official Spire Integration Partner (SIP)".
