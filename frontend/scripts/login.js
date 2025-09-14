const form = document.querySelector(".login-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    location.pathname = "frontend/aluno"
})