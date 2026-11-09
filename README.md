# Salahuddin Academy

Six-page front-end site for Salahuddin Martial Arts Academy in Astana. Open `index.html` in a browser. Bootstrap 5.3.3 is loaded from its CDN, so an internet connection is needed for the intended layout and mobile navigation.

The JavaScript starts from the local midterm archive. Most HTML changes add deferred script links; the home page also changes existing Bootstrap classes and image details. `css/style.css` is unchanged. New controls, results, group rows and review cards are created with DOM methods.

## Pages and visitor journeys

- Home: read about the academy, follow links to classes, coaches, schedule, prices and contact details, and open questions about locations, the trial form and the age of the timetable.
- Services: filter published groups by sport, branch, age, day and time of day, then select a group in the trial form and submit a checked demonstration request.
- Schedule: choose a day to see all matching classes from earliest to latest, filter by sport, branch, age and time of day, and see a result count and empty state.
- Coaches: search the published coach profiles and add or remove practice reviews stored only in this browser.
- Pricing: current prices were not confirmed in the supplied materials. Contact the academy for a current fee; the site does not calculate or collect payment.
- Contact: use the existing phone, email and map links to confirm a real visit.

The published group data comes from the September 2025 timetable already present in the midterm pages. Current capacity, fees, coach assignments and times need confirmation from the academy. A successful form creates only a demonstration reference. It sends nothing to a server and creates no booking. Reviews are also demonstrations, not verified academy testimonials.

The header has a local profile and a selected-classes list. The profile stores a name, phone, age and optional preferred sport in this browser; it is not registration or authentication. The visitor can clear these details. Selected classes are also stored in this browser and can be removed. Neither feature contacts the academy or reserves a place.

## Functionality Plan

| Page | Visitor goal | Planned function | Expected result | Responsible student |
|---|---|---|---|---|
| Services | Find an age-appropriate group | Filter by sport, branch and age | Matching cards, count, empty message and reset | Nurseyit Kalybai |
| Services | Ask about a trial | Check the form and compare age, sport, branch and date with the group | Field errors or a clear demonstration request summary | Nurseyit Kalybai |
| Schedule | Compare published times | Filter group rows by sport, branch and age | Matching rows, count, reset and contact link when empty | Tuleubayev Damir |
| Coaches | Find a coach | Search profiles by name or sport | Matching profiles, count, empty message and reset | Tuleubayev Damir |
| Coaches | Share practice feedback | Check the review form and create or remove cards | A dated demonstration review or field errors | Tuleubayev Damir |
| All pages | Use consistent group data | Share group data and rendering functions in `main.js` | The same group details on Services, Schedule and forms | Both students |

These are implementation areas from the earlier project division. Commit authorship and individual contribution must be confirmed in the real Git repository before submission.

## Files

- `js/main.js`: shared data and reusable functions
- `js/groups.js`: group finder and schedule rows
- `js/forms.js`: trial and group request validation
- `js/reviews.js`: demonstration review flow
- `javascript-checklist.md`: exact files and line references
- `evidence.md`: checks performed and remaining external checks

## Submission status

This version starts from the repository's `midterm` tag (`6a1abb6`). The Assignment 4–5 work is on `master` and remains on the `assignment-4-5` branch; the `midterm` tag stays unchanged. The required multi-day student commits cannot be produced retroactively.

## Assignment 6 jQuery

Services and Schedule use jQuery for group filtering, dynamic cards with visible times and a delegated button that selects a group in the request form, and the request form. Coaches uses jQuery for live search. The former plain-JavaScript versions of those three features are in js/old-js-version.js and are not loaded by any page. js/jquery-assignment.js contains the jQuery code and loads after jQuery 3.7.1 from its CDN. The review feature remains in js/reviews.js.

Form validation shows an error beside each invalid field, checks trimmed name, email, phone, age, group, date and consent, and shows a demonstration success message before resetting. Nothing is submitted to a server. Browser-side checks do not replace server validation for a real service.

The group selection button is delegated to the card list because those buttons are created by the filter. It fills the sport, branch and group in the request form and scrolls there. The form error fade-out, form status fade-in and scroll animation are functional effects. No new CSS rules or hand-written HTML elements were added. CDN access is needed for jQuery.

## Added for the endterm

- Home uses plain JavaScript in `js/main.js` to build three expandable questions from facts already stated on the site. The home panels now use the same Bootstrap card classes as the other pages; only classes and existing image details changed in HTML.
- Services and Schedule extend the earlier jQuery group finder with day-of-week and time-of-day filters. Schedule also builds a selected-day overview ordered by start time across both branches. Reset clears the new filters as well.
- Visitors can save published groups from Services or Schedule and review or remove them from the header on any page. The local profile in the header keeps visitor details on this device without creating an account. The form now shows sport, branch, group time, age and preferred date together before submission, with a button that returns to the choices.
- The local profile now also asks for a phone number and age. Both it and the trial forms accept names with letters and common name separators, require exactly ten national phone digits after the optional `+7`, and reject ages above 99.
