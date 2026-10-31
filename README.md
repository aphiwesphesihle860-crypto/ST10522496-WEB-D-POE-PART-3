# ST10522496-WEB-D-POE-PART-3
POE
# Aura Luxe Website

**Student:** Aphiwe Sphesihle Zulu (ST10522496) | **Module:** WEDE5020 - Web Development (Introduction) | **Part 3 - Enhancing Functionality and SEO**

Aura Luxe is a responsive static fragrance-retail website for a South African perfume brand based in Durban, KwaZulu-Natal. Part 2 delivered the design, layout and shopping cart. **Part 3 adds JavaScript interactivity, an interactive map, an image gallery with lightbox, product search, SEO, validated forms with AJAX submission, and deployment.**

> Where Scent Becomes Signature

- **GitHub repository:** https://github.com/aphiwesphesihle860-crypto/WEB-D-ST10522496
- **Live site (GitHub Pages):** https://aphiwesphesihle860-crypto.github.io/WEB-D-ST10522496/

---

## Table of Contents

1. [Changelog (including Part 2 feedback)](#changelog)
2. [Site Map and File Structure](#site-map-and-file-structure)
3. [Part 3 Features](#part-3-features)
4. [SEO Implementation](#seo-implementation)
5. [Forms and Validation](#forms-and-validation)
6. [Security](#security)
7. [Deployment](#deployment)
8. [Design System (from Part 2)](#design-system-from-part-2)
9. [Accessibility](#accessibility)
10. [How to Run Locally](#how-to-run-locally)
11. [Known Limitations and Future Improvements](#known-limitations-and-future-improvements)
12. [Testing](#testing)
13. [Contact](#contact)
14. [References](#references)

---

## Changelog

This changelog follows the *Keep a Changelog* format (Added / Changed / Fixed / Security) and is written so the lecturer can see exactly what changed, why, and where. Version numbers match the project parts: v1 = Part 1, v2 = Part 2, v3 = Part 3.

### Feedback received on Part 2 and how it was addressed

The Part 2 rubric gave these marks. Every criterion below 5/5 (or 10/10) was treated as feedback and acted on in Part 3.

| Part 2 criterion | Mark | What it tells me | Action taken in Part 3 | Where |
|---|---|---|---|---|
| Feedback for Part 1 and changelog | 5 / 10 | Changes were made but the changelog lacked detail. | This changelog now lists every change with problem, fix and file; it is grouped by version and by type of change. | README |
| External stylesheet in each page | 8 / 10 | Not every page used the shared stylesheet correctly; `Contact_us.html` carried its own inline CSS. | Inline CSS removed. All 8 pages link `css/style.css`; an automated test confirms the stylesheet loads on every page. | `css/style.css`, all pages |
| Default style code | 5 / 5 | Met in full. | Kept the reset, CSS variables and base styles; added utility classes instead of inline styles. | `css/style.css` |
| Typography styles | 5 / 5 | Met in full. | Kept Cormorant Garamond + Jost. | `css/style.css` |
| Layout structure | 5 / 5 | Met in full. | Kept Grid/Flexbox layout; new pages reuse the same layout classes. | `css/style.css` |
| Decoration and colour | 5 / 5 | Met in full. | Kept the navy / royal / gold palette; added success and error colours for forms. | `css/style.css` |
| Pseudo-classes used | 8 / 10 | Present but could be used more widely. | Added section 26: `:focus-within`, `:has(:checked)`, `:nth-child`, `:last-child`, `:not()`, `:empty`, `:disabled`, `:active`, `:visited`, `::selection`, `::placeholder` and `::after` effects. | `css/style.css` s.26 |
| Media queries / breakpoints | 8 / 10 | Only two breakpoints (900 px and 560 px). | Now 1400, 1200, 1024, 1000 (menu), 900, 768, 600, 480, a landscape-phone query and a print stylesheet. | `css/style.css` s.27, s.29 |
| Adjustment - layout | 5 / 5 | Met in full. | New toolbar, gallery, forms and footer all collapse correctly (tested at 320, 390, 768, 1024, 1280 and 1600 px with no horizontal scroll). | `css/style.css` |
| Adjustment - typography | 4 / 5 | Text sizes changed in steps at breakpoints, not smoothly. | Type scale now uses `clamp()` so headings scale fluidly; `text-wrap: balance`; tighter heading line-height on phones. | `css/style.css` s.2, s.28 |
| Adjustment - navigation menu | 3 / 5 | The mobile menu worked but was basic. | Animated slide-down menu, hamburger turns into an X, 44 px tap targets, two columns on tablets and one on phones, closes on link tap, outside tap, Esc and on resize, label changes between "Open menu" and "Close menu". | `css/style.css` s.15, `js/main.js` |
| Adjustment - images | 2 / 5 | Images only shrank with `max-width`; every device downloaded the same 2-3 MB file. | Three image sizes (480, 800 and 1200 px WebP) with `srcset` and `sizes` so each device downloads the right one; width/height set to stop layout shift; lazy loading; page weight cut from about 22 MB to about 1.4 MB. | `pictures/`, `js/shop.js`, `gallery.html` |
| GitHub - multiple descriptive commits | 2 / 5 | Too few commits and descriptions. | Work is committed in small steps with descriptive messages (see the commit plan below). | Git history |
| README contains all information | 3 / 5 | Present but could be improved. | Rewritten: overview, site map, feature tables, SEO, forms, security, deployment, testing, limitations, contact. | README |
| Changelog | 2 / 5 | Incomplete / lacking detail. | This section. | README |
| References | 5 / 5 | Met in full. | Kept the Harvard format and extended it for the new libraries and standards. | README |

### [3.0.0] - Part 3 - Functionality, SEO and Forms

#### Added
- **Interactive elements:** FAQ accordion, About-page tabs, quick-view modal, checkout modal (`js/main.js`).
- **Interactive map:** Leaflet map with studio, collection points, delivery zone, layer toggles and a "How far am I?" geolocation feature (`js/map.js`).
- **Gallery page** with family filters and a lightbox with keyboard, button and swipe navigation (`gallery.html`, `js/gallery.js`).
- **Dynamic products:** cards generated from `js/products-data.js`; search, family/audience filters, price slider, five sort options and deep links such as `products.html?family=Floral` (`js/shop.js`).
- **Enquiry form** (`enquiry.html`, `js/enquiry.js`) and rebuilt **contact form** (`js/contact.js`) with HTML5 + JavaScript validation (`js/forms.js`), AJAX submission, instant price/availability/delivery response and an e-mail composed for the recipient.
- **SEO:** unique title, meta description and meta keywords per page; canonical links; Open Graph and Twitter cards; JSON-LD (local business, website, product list, FAQ); `robots.txt`; `sitemap.xml`; breadcrumbs; footer links; share buttons.
- **Animations:** hero fade-up, scroll-reveal, hover and modal transitions; all disabled for `prefers-reduced-motion`.
- `404.html`, `favicon.svg`, `js/config.js` (recipient e-mail and AJAX endpoint).
- Contact details: e-mail `aphiwesphesihle860@gmail.com`, phone and WhatsApp `071 508 4296`.
- CSS: responsive-image rules, extra breakpoints, pseudo-class section, print stylesheet, utility classes.

#### Changed
- File names changed to clean URLs: `home.html` to `index.html`, `about_us.html` to `about-us.html`, `Product.html` to `products.html`, `Contact_us.html` to `contact-us.html`, `FAQ_and_Shipping_Policy.html` to `faq-shipping.html`.
- `style.css` moved to `css/style.css`; scripts live in `js/`.
- Heading hierarchy corrected (cards and family tiles are `h3`; one `h1` per page).
- Navigation expanded from 5 to 7 links and rebuilt as an animated responsive menu.
- Fluid typography with `clamp()`.
- Checkout button now opens an honest order-summary modal and leads to the enquiry form.
- Cart rebuilt with safe DOM methods and keyed by product id; old Part 2 carts are migrated automatically.
- Images converted from 22 MB of PNG/JPG (some mis-labelled) to descriptive WebP files in three sizes.

#### Fixed
- Broken "Contact us" link on Home and About pages (`Contuct_us.html` vs `Contact_us.html`).
- Contact page inline CSS that overrode the shared stylesheet.
- Placeholder map embed replaced with a real map.
- `Author: [Your name]` placeholder in the stylesheet.
- Misleading "Thanks for your order" message.
- Product images were cropped by a fixed height; now square with `aspect-ratio`.

#### Security
- Content-Security-Policy, no inline scripts or styles, `textContent` instead of `innerHTML`, input sanitising, honeypot spam field, `rel="noopener noreferrer"` on external links.

### [2.0.0] - Part 2 - CSS styling and responsive design
- Created the external stylesheet with reset, CSS variables, default styles, typography, layout (Grid/Flexbox), colour and decoration, and pseudo-class states.
- Added tablet (900 px) and mobile (560 px) media queries and a hamburger menu.
- Added the product page with ten fragrance cards, a persistent `localStorage` cart, FAQ and shipping page, and a contact page.

### [1.0.0] - Part 1 - Structure and content
- Planned the brand, mission, vision, audience and ten launch fragrances.
- Created the five HTML pages: home, about us, product, contact us, FAQ and shipping.

### Commit plan (GitHub)

The rubric rewards multiple, regular, descriptive commits. The scripts `git-commit-steps.sh` and `git-commit-steps.ps1` (supplied beside this project) create 17 small commits in a sensible order. Examples of the messages:

| Order | Commit message |
|---|---|
| 1 | `perf(images): convert product photos to descriptive WebP files in 480/800/1200 px sizes` |
| 2 | `style: move stylesheet to css/ and switch type scale to fluid clamp() values` |
| 3 | `style: add pseudo-class section, extra breakpoints and print stylesheet` |
| 4 | `feat(js): add shared main.js with responsive menu, accordion, tabs and focus-trapped modal` |
| 5 | `feat(products): add product data and dynamic rendering with search, filters and sorting` |
| 6 | `feat(cart): rebuild cart with safe DOM methods, quick-view modal and checkout summary` |
| 7 | `feat(gallery): add filterable gallery with keyboard and swipe lightbox` |
| 8 | `feat(map): add Leaflet map with layers and geolocation distance feature` |
| 9 | `feat(forms): add shared validation engine with AJAX submission` |
| 10 | `feat(enquiry): add enquiry form with instant estimate and delivery response` |
| 11 | `feat(contact): add contact form that composes an e-mail for the recipient` |
| 12 | `feat(pages): add accordion FAQ, tabbed About page and clean-URL navigation` |
| 13 | `feat(seo): add titles, descriptions, keywords, canonical, Open Graph and JSON-LD` |
| 14 | `feat(seo): add robots.txt, sitemap.xml, favicon and 404 page` |
| 15 | `fix: repair broken Contact link and remove inline CSS from contact page` |
| 16 | `docs: rewrite README with Part 3 features, security, testing and deployment` |
| 17 | `docs: add detailed changelog mapping Part 2 feedback to fixes` |

---

## Site Map and File Structure

```text
WEB-D-ST10522496/
|-- index.html            Home (brand intro, families, launch collection)
|-- about-us.html         About (tabs: story, mission & vision, differences, promise)
|-- products.html         Shop (dynamic products, search, filters, sort, cart, modals)
|-- gallery.html          Gallery with filter buttons and lightbox
|-- enquiry.html          Product / wholesale / gifting / partnership enquiry form
|-- contact-us.html       Contact details, contact form, interactive Leaflet map
|-- faq-shipping.html     FAQ accordion and delivery information
|-- 404.html              Friendly "page not found" page (used by GitHub Pages)
|-- robots.txt            Crawler instructions + sitemap location
|-- sitemap.xml           All public pages for search engines
|-- favicon.svg           Browser tab icon
|-- README.md             This document
|-- Git hub Link.txt      Link to the repository
|-- css/
|   `-- style.css         Part 2 design system + Part 3 components
|-- js/
|   |-- config.js         Recipient e-mail and AJAX endpoint (change here only)
|   |-- products-data.js  Single source of product data
|   |-- main.js           Navigation, accordion, tabs, modal, reveal animation, sharing
|   |-- shop.js           Products page: dynamic render, search, filter, sort, cart
|   |-- gallery.js        Gallery filter and lightbox
|   |-- map.js            Leaflet map and location feature
|   |-- forms.js          Shared validation, sanitising and AJAX helper
|   |-- enquiry.js        Enquiry form logic and instant estimate
|   `-- contact.js        Contact form logic and e-mail composition
`-- pictures/             10 products x 3 WebP sizes (480, 800 and 1200 px)
```

---

## Part 3 Features

### 2.1 Interactive elements

| Requirement | Where | How it works |
|---|---|---|
| **Accordion** | `faq-shipping.html` | Each question is a real `<button aria-expanded>` controlling a panel. Panels animate open with a max-height transition. "Expand all" toggles every item. Without JavaScript all answers are visible. |
| **Tabs** | `about-us.html` | WAI-ARIA tab pattern (`role="tablist"`, `tab`, `tabpanel`). Arrow keys, Home and End move between tabs. Without JavaScript all sections are shown one under another. |
| **Modals** | `products.html`, `gallery.html` | Quick-view modal, checkout summary modal and the lightbox share one `Aura.openModal()` function that locks page scroll, traps keyboard focus, closes on Esc / backdrop click and returns focus to the button that opened it. |
| **jQuery or frameworks** | - | The brief allows "jQuery or other possible JavaScript frameworks". Plain JavaScript (ES5-compatible) was used deliberately: no extra download, faster page, and no third-party code to secure. |

### Interactive map (`contact-us.html`)

- **Leaflet 1.9.4** with OpenStreetMap tiles (free, no API key). OpenStreetMap blocks tile requests from pages opened straight from a folder (`file:///`), so in that case the page shows OpenStreetMap's own embedded map (the same one used in Part 2); on GitHub Pages or a local server the interactive Leaflet map is used with the standard OpenStreetMap style.
- Studio marker with a popup, three planned collection-point markers and a 15 km same-day delivery zone circle.
- A **layer control** lets visitors switch each layer on and off.
- **Location-based feature:** the "How far am I from the studio?" button uses the browser Geolocation API (only after the visitor presses it), draws a line to the studio, zooms to fit both points and tells the visitor whether they are inside the same-day zone.
- A "Get directions" link opens turn-by-turn directions.
- If the map library cannot load, a text fallback with an OpenStreetMap link is shown.
- Scroll-zoom is enabled only after the visitor clicks the map so the map does not hijack page scrolling.

### Gallery with lightbox (`gallery.html`)

- Gallery is plain HTML (`<a href>` to the large image), so it works and is indexable without JavaScript.
- Filter buttons (`aria-pressed`) show one fragrance family at a time and announce the result count.
- Clicking an image opens the lightbox with a larger 1200 px version, caption, price and "3 / 10" counter.
- **Previous / next** buttons, **left / right arrow keys**, **swipe** on touch screens, **Esc** to close, and neighbouring images are pre-loaded.

### Animations and transitions

- Hero and page-intro fade-up animation (CSS `@keyframes`).
- Scroll-reveal using `IntersectionObserver` on cards, list items and gallery tiles. The `reveal` class is added by JavaScript so content is never hidden if JavaScript fails.
- Hover transitions on buttons, cards, tabs, gallery captions and navigation.
- Cart count "pop" animation, modal fade/scale, accordion slide.
- All motion is disabled for visitors with `prefers-reduced-motion`.

### Advanced DOM manipulation

- Product cards, cart rows, order summary, filters, enquiry fragrance checkboxes, error summaries and the response panels are all built with `document.createElement`, `append`, `replaceChildren` and `textContent` through the helper `Aura.el()`.
- Event delegation is used for cart buttons.
- Conditional form sections are shown and hidden based on the selected enquiry type.

### 2.2 Dynamic content and search (`products.html`)

- Product listings are **loaded dynamically** from `js/products-data.js`.
- **Search** across name, family, audience, notes and description (every word typed must match; 150 ms debounce).
- **Filter** by fragrance family, audience (Men / Women / Unisex) and maximum price (range slider).
- **Sort** by featured, price low to high, price high to low, name A-Z, name Z-A.
- Live "Showing 4 of 10 fragrances" message (`aria-live`), empty state with a link to the enquiry form, and "Reset filters".
- Deep links work: `products.html?family=Floral` and `products.html?q=oud`. The home page family tiles use these links.
- A `<noscript>` fallback lists the products for visitors without JavaScript.

---

## SEO Implementation

### 3.1 On-page SEO

**Keyword research.** Keywords were chosen from the business goals on the home page ("perfume shop Durban", "buy fragrances online SA") and from what customers on the site would search for. Each page targets a different primary phrase so pages do not compete with each other:

| Page | Primary keyword | Supporting keywords |
|---|---|---|
| index.html | perfume shop Durban | buy fragrances online South Africa, luxury perfume, long-lasting perfume |
| about-us.html | Durban perfume brand | fragrance families, authentic perfume South Africa, mission and vision |
| products.html | buy perfume online South Africa | 50ml eau de parfum, oud perfume, floral perfume, gourmand perfume |
| gallery.html | perfume gallery | Aura Luxe bottles, fragrance collection South Africa |
| enquiry.html | perfume enquiry | wholesale perfume South Africa, corporate gifting perfume, scent consultation Durban |
| contact-us.html | perfume shop Morningside Durban | Florida Road Durban, Durban fragrance shop |
| faq-shipping.html | perfume delivery South Africa | Courier Guy perfume, PayFast, perfume returns |

**Title tags and meta descriptions.** Every page has a unique title (under about 60 characters, primary keyword first, brand last) and a unique meta description (about 120-160 characters) written as a short sales sentence. A `<meta name="keywords">` tag is included on every page. Search engines such as Google ignore it for ranking, but it is included because the project brief lists it.

**Header tags.** One `h1` per page, `h2` for sections, `h3` for cards and sub-sections. No levels are skipped.

**Image optimisation.** Descriptive file names (`bloom-luxe-floral-perfume-480.webp`), descriptive `alt` text containing product, family and audience, explicit `width`/`height` (prevents layout shift), WebP format, three sizes served with `srcset` and `sizes` (so phones download the 480/800 px file, not the 1200 px one), and `loading="lazy"`.

**URL structure.** Short, lowercase, hyphenated, human-readable URLs with no spaces, underscores or capitals (`/products.html`, `/faq-shipping.html`). A canonical link is set on every page.

**Internal linking.** Breadcrumbs on every inner page, a footer sitemap on every page, contextual links inside body copy (for example the FAQ links to Products, Enquiry and Contact), family tiles that link to filtered product lists, and product names on the home page that link to a search for that product.

**Mobile friendliness.** Viewport meta tag, fluid grid/flexbox layout, three breakpoints, hamburger menu, large tap targets and no horizontal scroll at 390 px wide.

### 3.2 Off-page SEO

Off-page SEO happens mostly outside the website, so this project prepares the site for it and documents the plan:

- **Social media:** Open Graph and Twitter Card tags on every page (title, description and a 1200 px product image) so links shared on Facebook, WhatsApp, X and LinkedIn show a rich preview. "Share this page" buttons are in every footer. The brand already sells through Instagram and WhatsApp (see About page); the real profile URLs should be added to the footer and to the `sameAs` list in the JSON-LD once the accounts are final.
- **Local SEO:** `Store` / `LocalBusiness` structured data (JSON-LD) with name, address, telephone, e-mail, geo-coordinates, price range and service area. Name, address and phone are written identically in the header copy, footer, contact page and structured data (consistency is a local-ranking factor). The map and the "perfume shop Morningside Durban" wording support local searches.
- **Backlinks (action plan):** claim a Google Business Profile; list the business in South African directories; ask Durban fashion and lifestyle bloggers and fragrance influencers (target audience on the home page) to review products; supply the shareable gallery images; and publish scent-guide content that others will link to. Backlinks cannot be created from code, so none are faked.

### 3.3 Additional SEO requests

| Item | Implementation |
|---|---|
| **robots.txt** | `robots.txt` allows crawling, excludes `404.html` and points to the sitemap. (Note: crawlers only read robots.txt at the root of a domain; on a GitHub Pages project URL it is included for completeness and works once a custom domain is used.) |
| **sitemap.xml** | `sitemap.xml` lists all 7 public pages with `lastmod`, `changefreq` and `priority`. |
| **Page speed** | Image weight cut from about 22 MB to about 1 MB; lazy loading; `font-display=swap`; preconnect to the font hosts; scripts use `defer`; no JavaScript framework; one shared cached stylesheet. |
| **Security** | See [Security](#security). |
| **Structured data** | JSON-LD: `LocalBusiness`, `WebSite`, `ItemList` of `Product` with prices in ZAR, and `FAQPage`. |

---

## Forms and Validation

### 4.1 HTML forms

Both forms use proper `<label for>`, `<fieldset>`/`<legend>` for groups, correct input types (`email`, `tel`, `number`, `date`), `autocomplete` hints, `required`, `minlength`, `maxlength`, `min`, `max` and `pattern` attributes, and have an `action` and `method="post"` that point at the form-handling service (the fallback if JavaScript is off).

| Form | Fields |
|---|---|
| **enquiry.html** | Full name, email, South African phone, type of enquiry (product pricing, wholesale, gifting, partnership, consultation), fragrances (10 checkboxes), quantity, delivery area, gift wrapping, preferred reply method (radio), message (10-500 characters), consent. The product, quantity and delivery fields only appear for enquiry types that need them. |
| **contact-us.html** | Name, email, optional phone, type of message, optional preferred date, subject, message (20-1000 characters), consent. |

### 4.2 JavaScript validation

- `novalidate` is set so JavaScript can show friendly, consistent messages; the HTML5 attributes remain as the rules and as documentation.
- **Client-side validation** (`forms.js`) checks required fields, email format, South African phone format (`031 123 4567`, `0821234567` or `+27821234567`), name characters, minimum/maximum length, whole-number range, dates (no past dates, no more than a year ahead), required checkbox groups, and the **business rule that wholesale orders must total at least 10 units**.
- **Error handling:** errors appear under each field, the field gets a red border and `aria-invalid`, an error summary with links to each field appears at the top, and focus moves to the first invalid field. Fields re-validate as the visitor corrects them and turn green when valid.
- **AJAX submission:** `fetch()` sends the data as JSON with a 10-second timeout, without reloading the page. A status message reports success or failure.

### 4.3 Process response

**Enquiry form.** The page answers straight away with a reference number and:
- a price table (fragrance, quantity, unit price, line total, optional R30 gift wrapping, estimated total),
- availability (confirmed when we reply),
- estimated delivery time for the chosen area (Durban same/next day; KZN 1-2 days; other provinces 2-5 days - taken from the FAQ),
- the wholesale message when the 10-unit minimum is met, and the next step for partnership or consultation enquiries,
- how we will reply (email, WhatsApp or phone).

**Contact form.** The details are compiled into an e-mail addressed to the recipient in `js/config.js`. The page shows exactly what is being sent (to, subject, body), sends it by AJAX and also provides an **"Open in my email app"** button (a `mailto:` link) so the visitor can send it themselves if the AJAX service is unreachable.

**Recipient.** Messages go to `aphiwesphesihle860@gmail.com`, set in `js/config.js` (`recipientEmail`, `ajaxEndpoint`) and in the form `action` URLs. The AJAX service is FormSubmit.co: **the first submission sends an activation e-mail to that Gmail address - click the link in it once**, after which every form message arrives in the inbox.

**Assumptions made:** the R30 gift-wrapping fee is added once per enquiry; delivery fees are confirmed when the team replies; "availability" says all signature scents are in the current collection because the project has no stock database.

---

## Security

Because the site is static, security work focuses on the browser:

- **Content-Security-Policy** (meta tag) restricts scripts to the site itself and Leaflet's host, blocks inline scripts and inline style attributes, blocks plugins (`object-src 'none'`) and limits where forms may submit.
- **No unsafe HTML insertion:** dynamic content uses `textContent` / DOM methods rather than `innerHTML`, so product names, search text and form input cannot inject script.
- **Input sanitising:** `<` and `>` and control characters are stripped from every value before it is displayed or sent; length limits are enforced; a hidden **honeypot** field catches simple spam bots.
- **External links** use `rel="noopener noreferrer"`.
- **Referrer policy** `strict-origin-when-cross-origin`.
- **HTTPS:** GitHub Pages serves the site over HTTPS; enforce it under Settings > Pages > "Enforce HTTPS".
- **Privacy:** the geolocation API is only called after the visitor presses the button, and the location is never stored or sent anywhere.
- **Limits:** HTTP headers such as `X-Frame-Options` cannot be set on GitHub Pages, and client-side validation can always be bypassed, so a real shop would repeat every check on a server.

---

## Deployment

1. Copy the contents of this folder into the root of the GitHub repository `WEB-D-ST10522496`, so `index.html` is at the top level.
2. Commit with descriptive messages (examples in the changelog above) and push:
   ```bash
   git add .
   git commit -m "feat: Part 3 - JavaScript interactivity, SEO and validated forms"
   git push origin main
   ```
3. On GitHub open **Settings > Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After about a minute the site is live at `https://aphiwesphesihle860-crypto.github.io/WEB-D-ST10522496/`.
5. If a different host or a custom domain is used (Netlify, etc.), replace the base URL in `sitemap.xml`, `robots.txt` and the `canonical` / `og:url` tags.
6. Test the live site: every navigation link, the map, the lightbox, both forms and the mobile menu.

---

## Design System (from Part 2)

- **Typography:** *Cormorant Garamond* (headings, prices, brand) and *Jost* (body, navigation, forms), loaded from Google Fonts with a type scale `--step-1` to `--step-5`.
- **Colours** (CSS variables): navy `#10233F`, royal blue `#145A8A`, gold `#B8894B`, cream `#FBF7F1`, ink `#221C14`, white, and border `#E4DACB`. Gold is used for borders, underlines and accents on navy rather than for small text on cream, to keep contrast readable. Error red `#B3261E` and success green `#2E7D32` were added for form states.
- **Layout:** CSS Grid and Flexbox; breakpoints at 1000 px (hamburger menu), 900 px (tablet) and 560 px (mobile).
- **Components:** header/navigation, hero, cards, family tiles, product cards, cart panel, buttons with hover/focus/active states, footer, and the Part 3 additions (accordion, tabs, modal, lightbox, toolbar, forms, map).

## Accessibility

- Skip link, landmarks (`header`, `nav`, `main`, `footer`, `aside`), breadcrumbs with `aria-current`.
- Visible focus styles; every interactive control is a real `<button>` or `<a>` and works with the keyboard.
- Modals trap focus, close with Esc and return focus; tabs and the lightbox support arrow keys.
- Live regions (`role="status"`, `aria-live`) announce cart changes, search result counts, gallery filters and form results; errors use `role="alert"`.
- Error messages are linked to fields with `aria-describedby` and `aria-invalid`.
- Descriptive alt text; reduced-motion support; colour is never the only signal for errors.

## How to Run Locally

Open `index.html` in a browser, or for the most reliable result run a static server from this folder (for example the VS Code **Live Server** extension, or `python -m http.server`) and open `http://localhost:8000`. An internet connection is needed for Google Fonts, the Leaflet library, map tiles and the AJAX form service.

## Known Limitations and Future Improvements

- Checkout takes no payment; connect a backend and PayFast/Ozow/Payflex.
- Collection-point locations on the map are planned examples, and the studio coordinates should be checked against the real address.
- Stock is not tracked, so availability is confirmed manually.
- The FormSubmit.co endpoint needs the recipient to activate it once.
- Add real social-media profile links, Google Business Profile and customer reviews (review structured data).
- Add a working "Find Your Aura" scent quiz.

---

## Testing

Tested in headless Chromium (Playwright) against a local web server, plus manual checks of the layout screenshots.

| Test | Result |
|---|---|
| Each of the 8 pages has exactly one `h1` and loads `css/style.css` | Pass |
| No horizontal scrolling at 320, 390, 768, 1024, 1280 and 1600 px on all pages | Pass |
| Products: 10 cards render; search ("vanilla" gives 4); family + sort; empty state; reset; `?family=Floral` deep link | Pass |
| Cart add, quantity, total; quick-view modal; checkout modal; Esc closes modal | Pass |
| Gallery filter; lightbox opens, next/previous with arrow keys, counter updates | Pass |
| FAQ accordion open/close and "Expand all"; About tabs by click and arrow keys | Pass |
| Mobile menu opens, closes on outside tap and Esc | Pass |
| Phone browser picks the 800 px image for a 390 px wide 2x screen | Pass |
| Contact form: empty submit shows 6 errors; bad e-mail/phone/name show messages; valid submit shows composed e-mail and AJAX status | Pass |
| Enquiry form: errors for empty fields; wholesale rejected under 10 units; valid wholesale gives estimate, availability and delivery time | Pass |
| No Content-Security-Policy violations or JavaScript errors in the console | Pass |

Not testable offline: the live Leaflet map tiles and the FormSubmit.co mail delivery. Please check both once on the deployed site.

## Contact

- E-mail: aphiwesphesihle860@gmail.com
- Phone / WhatsApp: 071 508 4296 (+27 71 508 4296)
- Repository: https://github.com/aphiwesphesihle860-crypto/WEB-D-ST10522496

---

## References

Leaflet (2023) *Leaflet - an open-source JavaScript library for interactive maps* (version 1.9.4). Available at: https://leafletjs.com (Accessed: 27 October 2026).

OpenStreetMap contributors (2026) *OpenStreetMap*. Available at: https://www.openstreetmap.org/copyright (Accessed: 27 October 2026).

MDN Web Docs (2026) *Constraint validation*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation (Accessed: 27 October 2026).

MDN Web Docs (2026) *Fetch API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API (Accessed: 27 October 2026).

MDN Web Docs (2026) *Geolocation API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API (Accessed: 27 October 2026).

MDN Web Docs (2026) *Intersection Observer API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API (Accessed: 27 October 2026).

MDN Web Docs (2026) *Content Security Policy (CSP)*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP (Accessed: 27 October 2026).

W3C (2024) *WAI-ARIA Authoring Practices Guide: Tabs, Accordion and Dialog (Modal) patterns*. Available at: https://www.w3.org/WAI/ARIA/apg/ (Accessed: 27 October 2026).

W3C (2018) *Web Content Accessibility Guidelines (WCAG) 2.1*. Available at: https://www.w3.org/TR/WCAG21/ (Accessed: 27 October 2026).

Google (2026) *Search Engine Optimization (SEO) Starter Guide*. Google Search Central. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: 27 October 2026).

Google (2026) *Intro to structured data markup in Google Search*. Google Search Central. Available at: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data (Accessed: 27 October 2026).

Google (2026) *Create and submit a robots.txt file* and *Build and submit a sitemap*. Google Search Central. Available at: https://developers.google.com/search/docs (Accessed: 27 October 2026).

Schema.org (2026) *LocalBusiness, Product, ItemList and FAQPage*. Available at: https://schema.org (Accessed: 27 October 2026).

The Open Graph protocol (2026) *Open Graph protocol*. Available at: https://ogp.me (Accessed: 27 October 2026).

FormSubmit (2026) *FormSubmit - form backend for static websites*. Available at: https://formsubmit.co (Accessed: 27 October 2026).

GitHub (2026) *Configuring a publishing source for your GitHub Pages site*. GitHub Docs. Available at: https://docs.github.com/en/pages (Accessed: 27 October 2026).

Google (2026) *Google Fonts: Cormorant Garamond and Jost*. Available at: https://fonts.google.com (Accessed: 27 October 2026).

Product images: the Aura Luxe images from the Part 2 submission, resized and converted to WebP for Part 3.
