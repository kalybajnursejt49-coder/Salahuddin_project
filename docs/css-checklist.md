# CSS rules replaced by Bootstrap

| Removed Assignment 2 rule | Bootstrap replacement |
|---|---|
| Fixed 1080px page widths and centered margins | `container` and `container-fluid` |
| Hand-built main content columns and card layout | `row`, `g-4`, `col-12`, `col-md-6`, `col-lg-4` |
| Hand-built navigation flex layout and responsive menu | `navbar`, `navbar-expand-lg`, `navbar-toggler`, `collapse` |
| Custom panel padding, borders and shadows | `p-4`, `border`, `rounded-3`, `shadow-sm` |
| Custom form input appearance | `form-control`, `form-select`, `btn` variants |
| Custom table striping and hover rules | `table`, `table-striped`, `table-hover`, `table-responsive` |
| Hand-written page spacing and alignment rules | Bootstrap spacing, text alignment and display utilities |

The empty `base.css`, `damir.css` and `nurseyit.css` files were removed. Unstyled page-specific classes were removed from the HTML. The remaining `css/style.css` sets academy colors and fonts, image sizing, a focus outline and the practice-note accent; it does not create a layout grid or navigation layout.
