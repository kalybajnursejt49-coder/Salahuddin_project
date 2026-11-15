# Salahuddin Martial Arts Academy

Six-page front-end site for a martial arts academy in Astana: Home, Services, Coaches, Schedule, Pricing and Contact. Open index.html in a browser with internet access for Bootstrap 5.3.3 and jQuery 3.7.1.

## Visitor flow

1. Find a group on Schedule by sport, branch, age, day and time.
2. Open Services from the selected group, complete local Registration and choose a class date.
3. Review the practice request and contact the academy to confirm a real place.

Registration, favourites and reviews stay in this browser. The request form does not send data or make a booking. For a child, the Services form requires a parent or guardian name. Dates are checked against the selected group's days; the group must fit the registered age. Published times, availability and contact details should be confirmed with the academy before visiting.

Pricing displays indicative amounts and a budget calculator. These amounts are not a confirmed academy price list; no payment is taken here.

## Code and assets

- js/main.js: shared group data, local Registration, favourites, guides and budget calculator
- js/jquery-assignment.js: group finder, schedule rows, coach search and class request
- js/reviews.js: local practice reviews
- js/language.js: English, Russian and Kazakh interface text
- css/style.css: site styles and accessibility fixes
- images/: six optimized WebP assets with intrinsic dimensions

Course checklists, evidence notes and the AI log are in docs/.

## Quality checks

Check all six pages in two browsers and on a phone. In each language, inspect the menu, buttons, forms, validation messages, group cards and footer. Use keyboard Tab/Enter/Escape, check console errors, run the W3C HTML validator and confirm image sizes in Network. See docs/evidence.md for earlier notes. JavaScript syntax and static links can also be checked locally.
