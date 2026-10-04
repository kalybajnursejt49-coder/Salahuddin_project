document.querySelectorAll("form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const result = form.querySelector(".form-message");
        result.classList.remove("is-hidden");
    });
});
