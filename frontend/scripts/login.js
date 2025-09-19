const form = document.querySelector(".login-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const res = await fetch("http://localhost:3333/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    const result = await res.json();

    if (!res.ok) {
        alert(result.error);
        return;
    }

    const roleTranslation = {
        student: "aluno",
        teacher: "professor",
        pedagogue: "pedagogo"
    }

    localStorage.setItem("token", result.token);
        
    location.pathname = "frontend/" + roleTranslation[result.data.role];
});
