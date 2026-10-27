# Evidence and remaining checks

Checked on 19 and 27 October 2026 with Chrome in a local headless browser:

- All six pages loaded at 375 px, 768 px and 1280 px without JavaScript page errors.
- Submitting the trial form empty showed multiple field-level errors.
- A valid name, email, phone, age, branch, group, matching future weekday and consent produced a demonstration reference and stated that no booking was created.
- A practice review with a name, rating and sufficient text appeared as a separate card.
- Schedule filtering returned 2 judo groups, a no-results state for judo at Turan 19, and all 16 groups after reset.
- A demonstration review could be removed again.
- Services showed a phone link for every matching group, a contact link for no results, and no old Choose action.
- The form narrowed group choices by sport, branch and age, marked the selected group, and accepted a matching future group day.
- Coach search hid unmatched profiles, showed an empty message and restored all four profiles after reset.
- No horizontal overflow appeared on the six pages at 375 px, 768 px or 1280 px in this test.
- `node --check` passed for the four JavaScript files used by the pages.
- Compared with the `midterm` tag, CSS had no changes and the six HTML pages only gained deferred script links.

The browser environment could not load the existing Bootstrap CDN. Mobile visual styling and the Bootstrap navigation still need a browser check with internet access. Also run W3C validation, review links and images, and confirm the repository tags and real commit history.
