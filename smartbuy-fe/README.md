# smartbuy React UI

A React + Ant Design single-page catalog inspired by the Ecobazar vegetable marketplace layout.

## Getting started

```bash
npm install
npm run dev
```

The development server defaults to `http://localhost:5173`.

## Tech stack

- React 18 with Vite for ultra-fast dev tooling.
- Ant Design 5 for UI primitives and layout.
- Custom CSS modules to follow the provided high-fidelity design.

The UI is composed from reusable sections (`AppHeader`, `FilterSidebar`, `ProductGrid`, `Newsletter`, `AppFooter`) with dedicated pages:

- `Home` (`src/pages/Home.jsx`) – landing page featuring hero banner, category highlights, testimonials, and curated best sellers.
- `About` (`src/pages/About.jsx`) – storytelling page covering the brand mission, core benefits, team, and customer feedback.
- `Contact` (`src/pages/Contact.jsx`) – support hub with contact information, inquiry form, and map preview.
- `Shop` (`src/pages/Shop.jsx`) – catalog grid with filters, sorting, and product-to-detail navigation.
- `Product Detail` (`src/pages/ProductDetail.jsx`) – immersive experience for a single SKU with gallery, tabs, feature highlights, and related products.

Both screens rely on static sample data in `src/data/products.js` and `public/mock/products.json`.

## Internationalization

The interface ships with Vietnamese (`vi`) and English (`en`) translations powered by a lightweight locale context (`src/i18n`). Use the language switcher in the header to toggle instantly between the two.
# smartbuy-fe
