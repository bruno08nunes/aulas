const userId = new URLSearchParams(location.search).get("id");
let user;

const token = localStorage.getItem("token");

const getUser = async () => {
    const res = await fetch("http://localhost:3333/users/" + userId);
    const result = await res.json();
    user = result;

    document.querySelector("#name").value = result.name;
    document.querySelector("#email").value = result.email;
    document.querySelector("#cellphone").value = result.cellphone;
};

getUser();

const listSubjects = async () => {
    const res = await fetch("http://localhost:3333/subjects");
    const result = await res.json();

    const subjectSelect = document.querySelector("#subject");

    for (let pos of result) {
        subjectSelect.innerHTML += `<option value=${pos.id}>${pos.name}</option>`;
    }
};

const form = document.querySelector(".form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const cellphone = document.querySelector("#cellphone").value;

    const subjectsElement = document.querySelector("#subject");
    var selectedOptions = [];

    for (var i = 0; i < subjectsElement.options.length; i++) {
        if (subjectsElement.options[i].selected) {
            selectedOptions.push(subjectsElement.options[i].value);
        }
    }

    const res = await fetch("http://localhost:3333/users/" + userId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
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
        const res = await fetch("http://localhost:3333/teachers/sync", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                teacherId: user.teacher_id,
                subjects: selectedOptions,
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
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            alert("Erro");
            return;
        }

        location.pathname = "frontend/pedagogo";
    });

listClasses();
