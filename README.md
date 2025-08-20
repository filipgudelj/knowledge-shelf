# 📚 Knowledge Shelf – Book Webshop

A **book webshop** built with **Nuxt** and **Supabase**, designed to be clean, fast, and user-friendly.

<img width="1902" height="948" alt="Home" src="https://github.com/user-attachments/assets/19c20983-5b08-4a98-9d0e-89c8854a3d19" />

---

## ✨ Features

- 🌓 **Light/Dark mode**
- 🌐 **Multilingual support (i18n)** with language switcher
- 🛒 **Webshop flow:** cart → checkout → Stripe payment → confirmation email
- ⭐ **Favourites** management
- 🔐 **User authentication** (login, register, role-based access)

---

## 🛠 Tech Stack

- **Framework:** Nuxt 3
- **Backend & DB:** Supabase
- **State:** Pinia
- **Payments:** Stripe
- **Internationalization:** i18n
- **Styling:** SCSS (BEM)
- **Auth:** Supabase Auth
- **Deploy:** Netlify

---

## 🚀 Project Setup
```bash
# 1. Clone the repository
git clone [repo]

# 2. Enter the project folder
cd knowledge-shelf

# 3. Install dependencies
npm install

# 4. Create a .env file and fill it with the correct data

# 5. Build the project
npm run build

# 6. Start the development server
npm run dev
```

---

## 📂 Folder Structure
```bash
├── assets/                # SCSS styles (colors, spacings, typography, etc.)
├── components/
│   ├── layout/            # Layout components
│   │   ├── sidebar/
│   │   └── topbar/
│   └── shared/            # Reusable UI parts
│       ├── books/
│       ├── charts/
│       ├── core/
│       └── form/
├── composables/           # useFavouriteCookie, useToast
├── helpers/               # formatters
├── i18n/                  # translations
├── layouts/               # default, explore
├── middleware/            # user role redirection, color theme refresh control
├── pages/                 # app pages
├── public/                # images, SVGs
├── server/api/stripe      # Stripe logic
├── stores/                # auth, books, cart, favourites, orders
└── types/                 # TypeScript types
```
