# Implement Dark/Light Mode Theme Toggle

I will implement a fully functional dark/light theme toggle. This requires defining global color variables and updating component styles to use these variables instead of hardcoded colors.

## 1. Global Styles & Variables (`src/assets/main.css`)
-   Define CSS variables for colors (background, text, border, primary color, etc.) in `:root`.
-   Define the override values for `html.dark`.
-   **Variables to create:**
    -   `--bg-body`: Page background
    -   `--text-primary`: Main text color
    -   `--text-secondary`: Secondary text color
    -   `--primary-color`: Accent color (blue)
    -   `--border-color`: Border color
    -   `--card-bg`: Card/Content background
    -   `--navbar-bg`: Navbar background (with transparency)

## 2. Navbar Update (`src/components/Navbar.vue`)
-   Import `Sun` and `Moon` icons from `lucide-vue-next`.
-   Add `isDark` state using `ref` and `localStorage` for persistence.
-   Add a toggle button next to the language switcher.
-   Implement `toggleTheme` function to add/remove the `dark` class on the `<html>` element.

## 3. Component Style Refactoring
Replace hardcoded hex colors with the new CSS variables in the following components to ensure they adapt to dark mode:
-   `src/components/Navbar.vue`
-   `src/components/Sidebar.vue` (Update background, text, avatar border, social icons)
-   `src/components/SectionAbout.vue` (Update text colors)
-   `src/components/SectionNews.vue` (Update timeline colors, card backgrounds)
-   `src/components/SectionPubs.vue` (Update link buttons, text colors)
-   `src/components/SectionGallery.vue` (Update card overlays, backgrounds)
-   `src/views/HomeView.vue` (Update layout backgrounds if any)

## Verification
-   Clicking the toggle button should switch the theme immediately.
-   The preference should persist after page reload.
-   All sections should be readable in both light and dark modes.
