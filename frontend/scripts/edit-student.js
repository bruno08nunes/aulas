const userId = new URLSearchParams(location.search).get("id");
let user;

const getUser = async () => {
    const res = await fetch("http://localhost:3333/users/" + userId);
    const result = await res.json();
    user = result;

    document.querySelector("#name").value = result.name;
    document.querySelector("#email").value = result.email;
    document.querySelector("#cellphone").value = result.cellphone;
};

getUser();

const listClasses = async () => {
    const res = await fetch("http://localhost:3333/classes");
    const result = await res.json();

    const classesElement = document.querySelector("#class");

    for (let pos of result) {
        classesElement.innerHTML += `<option value=${pos.id}>${pos.name}</option>`;
    }
};

const form = document.querySelector(".form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const cellphone = document.querySelector("#cellphone").value;

    const classElement = document.querySelector("#class");
    var selectedOptions = [];

    for (var i = 0; i < classElement.options.length; i++) {
        if (classElement.options[i].selected) {
            selectedOptions.push(classElement.options[i].value);
        }
    }

    const res = await fetch("http://localhost:3333/users/" + userId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            email,
            password,
            cellphone,
        }),
    });
    const result = await res.json();

    if (!res.ok) {
        alert("Erro");
    }

    if (selectedOptions.length) {
        const res = await fetch("http://localhost:3333/students/sync", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                studentId: user.student_id,
                classes: selectedOptions,
            }),
        });
    }

    location.pathname = "frontend/pedagogo";
});

document
    .querySelector(".delete-button")
    ?.addEventListener("click", async () => {
        const res = await fetch("http://localhost:3333/users/" + userId, {
            method: "DELETE",
        });

        if (!res.ok) {
            alert("Erro");
            return;
        }

        location.pathname = "frontend/pedagogo";
    });

listClasses();
