XLeratorAI Website – README
===========================

Overview
--------
This folder contains the full multi‑page website for XLeratorAI, including
all HTML pages, CSS styles, JavaScript, logos, and product screenshots.
The site uses a standard, clean structure designed for easy maintenance
and future expansion.

Folder Structure
----------------
/xleratorai
│
├── index.html
├── solutions.html
├── lab.html
├── success.html
├── about.html
├── board.html
├── contact.html
│
├── /css
│     └── styles.css
│
├── /img
│     ├── logo-main.png
│     ├── logo-lab.png
│     ├── favicon.png
│     ├── pmo-accelerator.png
│     ├── strategy-accelerator.png
│     └── (additional images as needed)
│
└── /js
      └── main.js


Page Descriptions
-----------------
index.html
    Home page with hero section, offerings, featured products, and client success preview.

solutions.html
    Overview of AI Solutions, AI Staffing, and AI Products (SaaS / On‑Prem).

lab.html
    XLeratorAI Lab page featuring product descriptions, screenshots, and demo CTAs.

success.html
    Client success stories with Problem → Solution → Outcome format.

about.html
    Mission statement and leadership team bios.

board.html
    Placeholder Board of Directors page with avatars and short bios.

contact.html
    Contact form for inquiries and working session requests.


Assets
------
All logos, product screenshots, and future images should be placed in the /img folder.
The HTML files reference these images using relative paths (e.g., img/logo-main.png).


Styling
-------
The site uses a single global stylesheet located at:
    /css/styles.css

Typography uses the Inter font family via Google Fonts.
Color palette is light mode with dark‑blue primary and electric‑blue accents.


JavaScript
----------
The /js/main.js file is included for optional enhancements such as:
- Navigation behavior
- Form handling
- Animations

It currently contains a simple placeholder.


Deployment Notes
----------------
This site is fully static and can be hosted on:
- GitHub Pages
- Netlify
- Vercel
- Any standard web server

No build tools or frameworks are required.


Contact
-------
For updates or new pages, follow the existing structure to maintain consistency.