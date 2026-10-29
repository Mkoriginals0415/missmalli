# Miss Malli UX/UI Audit Document
*Generated based on new PRD (`new prd.docx`) and Mockup Suite (`new design.pdf`)*

## 1. Executive Summary
This document records the baseline UX/UI audit for the Miss Malli e-commerce application. The goal is to elevate the storefront to a luxury, mobile-first women's ethnic wear brand with frictionless WhatsApp checkout and a robust, secure admin management panel.

## 2. Component-by-Component Findings & Fixes

| Area / Component | Current Observed Behavior | Target Behavior (`new design.pdf`) | Priority | Verification Method |
| :--- | :--- | :--- | :--- | :--- |
| **Header & Navbar** | Generic links, logo centering issues on some mobile breakpoints | Mathematically centered logo, 5 explicit category links, responsive search & wishlist counters | High | Viewport check at 360px & 390px |
| **Category Discovery** | Queries only (`/sarees?collection=...`) | 4 prominent category cards with live style counts (Sarees 240+, Dresses 120+, Materials 90+, Exclusive 40+) and direct clean routes (`/dresses`, `/materials`, etc.) | High | Click all cards on Home & Nav |
| **Hero Section** | Standard hero banner | Preserved heritage drape art direction with responsive positioning, readable editorial typography, and high-contrast CTA | High | Mobile 390px scroll verification |
| **Product Cards** | Standard rounded cards | Notched image cards (22px radius), badge overlays ("New", "Bestseller", "-15%"), instant wishlist heart toggle, and "+ quick view" | Medium | Grid inspection |
| **Product Detail Page (PDP)** | Basic details and WhatsApp button | Multi-image swipe gallery, pincode delivery estimator, Silk Mark / 7-day return badges, expandable accordions, "Complete the Look" bundle items | High | Test PDP on mobile and desktop |
| **Bag & Checkout** | Item list with total | Promo coupon input with instant calculation, variant details, quantity steppers, and pre-formatted WhatsApp multi-item payload | High | Trigger WhatsApp checkout |
| **Our Story / Artisans** | Absent / placeholder text | Dedicated `/artisans` story page with impact metrics (200+ weaver families, 12 clusters) and artisan biographies (Kanchipuram, Varanasi, Pochampally) | Medium | Route navigation test |
| **Admin Security** | Unauthenticated access on `/admin` | Server-enforced authentication barrier at `/admin/login` using HTTP-only signed session cookies | Critical | Unauthorized access attempt returns 302 redirect |
| **Admin Management** | Basic UI with mock counters | Real database-backed metrics, status toggles for WhatsApp requests (`Needs Reply` ➔ `Confirmed` ➔ `Dispatched`), live stock editing | High | Admin CRUD testing |
