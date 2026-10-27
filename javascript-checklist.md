# JavaScript checklist

| Requirement | Exact location |
|---|---|
| `js` folder, shared and page files, strict mode | `js/main.js:1`, `js/groups.js:1`, `js/forms.js:1`, `js/reviews.js:1` |
| Array of 16 objects with sport, branch, days, time and age bounds | `js/main.js:3` |
| Reusable functions with parameters and return values | `js/main.js:26`, `js/main.js:33`, `js/main.js:39`, `js/main.js:43` |
| Function calling another function | `js/groups.js:106` calls `renderList`, which calls `createRow` through the parameter at `js/main.js:35` |
| Loop, filter, find, transform and count | `js/main.js:35`, `js/groups.js:50`, `js/groups.js:89`, `js/forms.js:76` |
| Arithmetic and meaningful random value | `js/main.js:50`, `js/forms.js:160` |
| `===`, `!==`, `&&` and `||` in project rules | `js/groups.js:51`, `js/forms.js:144` |
| DOM creation/removal and repeated rendering | `js/main.js:26`, `js/main.js:33`, `js/groups.js:57`, `js/reviews.js:110` |
| Group filters, count, no results, contact link and reset | `js/groups.js:88`, `js/groups.js:95`, `js/groups.js:112`, `js/groups.js:124` |
| Coach search, count, no results and reset | `js/reviews.js:17`, `js/reviews.js:25`, `js/reviews.js:29` |
| Group selection and live summary | `js/forms.js:39`, `js/forms.js:80`, `js/forms.js:87` |
| Submit, click, input and change events | `js/forms.js:152`, `js/groups.js:121`, `js/reviews.js:28`, `js/reviews.js:29` |
| Hidden, active, selected, error and success states | `js/reviews.js:22`, `js/forms.js:82`, `js/forms.js:83`, `js/forms.js:116`, `js/forms.js:162` |
| Field errors, first invalid focus, clear old errors | `js/forms.js:48`, `js/forms.js:120`, `js/forms.js:148` |
| Name, email, phone, age, selection and linked date checks | `js/forms.js:120` |
| Safe review cards, counter, validation and removal | `js/reviews.js:82`, `js/reviews.js:110`, `js/reviews.js:118`, `js/reviews.js:142` |
| Only script links added to HTML; no CSS rules added | `services.html:162`, `schedule.html:289`, `coaches.html:105` and one `main.js` link in each other page |

Cart and login are not applicable: the site does not sell online and has no account pages. No fee is calculated because the supplied project has no verified current prices.
