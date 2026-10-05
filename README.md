# Salahuddin Martial Arts Academy

A responsive six-page website for a martial arts academy in Astana. The project uses plain HTML, CSS and JavaScript so that the structure and interactions are easy to follow in a student presentation.

## Pages

- `index.html` — academy introduction and links to the main sections
- `services.html` — four classes and a trial-class enquiry form
- `coaches.html` — coach profiles based on academy posts
- `schedule.html` — published class timetable with location and sport filters
- `pricing.html` — questions to ask the academy; no unconfirmed prices are shown
- `contact.html` — contact details and location links

## Run the site

Open `index.html` in a browser. The fonts load from Google Fonts when an internet connection is available. All page styles, images and interactions are stored in this project.

## How the main features work

- The navigation links connect the six HTML pages. On a small screen, the menu button opens and closes the navigation.
- The schedule filter buttons compare each timetable row's `data-branch` and `data-sport` values, then hide rows that do not match.
- The trial form uses built-in browser checks for required fields. JavaScript displays a demo confirmation after submission. The form does not send or store personal details.
- The FAQ answers use the browser's built-in `<details>` and `<summary>` elements.

## Project folders

- `css/style.css` — shared colours, page layout, responsive rules and accessibility styles
- `js/main.js` — mobile menu, timetable filters and enquiry form interaction
- `images/` — academy and coach images used by the pages

Published coach and schedule details are based on academy posts from September 2025. Contact the academy to confirm current groups, fees, locations and availability.
\n