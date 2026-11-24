# Smart Tools — SEO & Google Search Console release checklist

## Included in this branch
- `/robots.txt`: allows public crawling and advertises the sitemap.
- `/sitemap.xml`: lists the homepage and tool URLs declared in `src/data/toolsData.ts`.
- GitHub Actions workflow: installs dependencies, runs TypeScript validation and builds the Vite production bundle on pushes and pull requests.

## Before submitting this branch
1. Confirm that `https://toolzy.online/` is the final live domain. If the domain has changed, update the canonical URL in `index.html`, every sitemap URL and the sitemap declaration in `robots.txt` together.
2. Confirm Cloudflare Pages uses the `main` branch for production and the normal Vite build command `npm run build` with output directory `dist`.
3. Check the Actions run named **Build and Typecheck**. Do not merge while it is failing.
4. Preview the branch deployment (if Cloudflare preview deployments are enabled). Test the homepage and representative tool URLs on mobile and desktop. Check browser console, downloads, PDF/image processing and ad placements.

## Google Search Console — step by step
1. Open Google Search Console: https://search.google.com/search-console/
2. Choose **Add property**.
3. Prefer **Domain** property for complete coverage. Enter `toolzy.online` without protocol or path.
4. Copy the TXT verification record Google provides.
5. In Cloudflare, open the `toolzy.online` zone → DNS → Records → Add record → choose TXT. Paste Google's exact name/content and save. Do not remove existing DNS records.
6. Return to Search Console and press **Verify**. DNS propagation can take time.
7. In Search Console → Sitemaps, enter `sitemap.xml` and submit.
8. Use URL Inspection for `https://toolzy.online/` and important tool URLs. Run **Test Live URL**, then **Request Indexing** where available.
9. Review **Page indexing**, **Core Web Vitals**, HTTPS and enhancement reports periodically. Fix issues before requesting indexing again.

## Important SEO notes
- Sitemap submission is a discovery hint, not a ranking or instant-indexing guarantee.
- Keep each tool page useful, accurate and distinct. Avoid repeated keyword stuffing or thin near-duplicate pages.
- Ensure every sitemap URL returns HTTP 200, is canonical, indexable and not blocked by robots/noindex.
- Search Console reports can take days or weeks to reflect changes.
- Google Analytics and Adsterra code were intentionally not edited in this branch.

## Performance and large-file expectations
This branch adds CI checks and crawl-discovery files only. It does not claim to have optimized image/PDF memory use. Browser-side PDF/image processing still depends on device memory, browser limits and file complexity. A later performance pass should use representative large test files, Web Workers where suitable, bounded processing and explicit file-size/page-count safeguards.
