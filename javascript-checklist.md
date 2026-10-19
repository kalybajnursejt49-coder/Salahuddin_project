# JavaScript checklist

| Requirement | Exact location |
|---|---|
| `js` folder, shared and page files, strict mode | `js/main.js:1`, `js/groups.js:1`, `js/forms.js:1`, `js/reviews.js:1` |
| Array of 16 objects with sport, branch, days, time and age bounds | `js/main.js:3` |
| Reusable functions with parameters and return values | `js/main.js:26`, `js/main.js:33`, `js/main.js:39`, `js/main.js:43` |
| Function calling another function | `js/groups.js:109` calls `renderList`, which calls `createRow` at `js/main.js:35` |
| Loop, filter, find, transform and count | `js/main.js:35`, `js/groups.js:50`, `js/groups.js:109`, `js/forms.js:76` |
| Arithmetic and meaningful random value | `js/main.js:50`, `js/forms.js:169` |
| `===`, `!==`, `&&` and `||` in project rules | `js/groups.js:51`, `js/forms.js:136` |
| DOM creation/removal and repeated rendering | `js/main.js:26`, `js/main.js:33`, `js/groups.js:57`, `js/reviews.js:77` |
| Search/filter count, no results and reset | `js/groups.js:109`, `js/groups.js:136` |
| Group selection and live summary | `js/forms.js:80`, `js/forms.js:85`, `js/forms.js:106` |
| Submit, click, input and change events | `js/forms.js:161`, `js/groups.js:81`, `js/groups.js:135`, `js/groups.js:133` |
| Hidden, active, selected, error and success states | `js/groups.js:82`, `js/forms.js:53`, `js/forms.js:125`, `js/forms.js:171` |
| Field errors, first invalid focus, clear old errors | `js/forms.js:48`, `js/forms.js:123`, `js/forms.js:129` |
| Name, email, phone, age, selection and linked date checks | `js/forms.js:129` |
| Safe review cards, counter, validation and removal | `js/reviews.js:43`, `js/reviews.js:77`, `js/reviews.js:109` |
| Only script links added to HTML; no CSS rules added | `services.html:162`, `schedule.html:289`, `coaches.html:105` and one `main.js` link in each other page |

Cart and login are not applicable: the site does not sell online and has no account pages. No fee is calculated because the supplied project has no verified current prices.
