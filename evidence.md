# Evidence and remaining checks

Checked on 19 October 2026 with Chrome in a local headless browser:

- All six pages loaded at 375 px, 768 px and 1280 px without JavaScript page errors.
- Submitting the trial form empty showed multiple field-level errors.
- A valid name, email, phone, age, branch, group, matching future weekday and consent produced a demonstration reference and stated that no booking was created.
- A practice review with a name, rating and sufficient text appeared as a separate card.
- Schedule filtering returned 2 judo groups, a no-results state for judo at Turan 19, and all 16 groups after reset.
- A demonstration review could be removed again.
- `node --check` passed for all four JavaScript files.

The browser environment could not load the existing Bootstrap CDN. Mobile visual checks and horizontal-overflow results are therefore inconclusive; the source midterm pages depend on that CDN. Open the site with internet access at 375 px, 768 px and desktop width before submission, check every page and Bootstrap navigation, and capture screenshots there. Also run W3C validation, review links and images, and confirm the repository tags and real commit history.
