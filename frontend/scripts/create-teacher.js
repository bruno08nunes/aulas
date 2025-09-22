const listSubjects = async () => {
    const res = await fetch("http://localhost:3333/subjects");
    const result = await res.json();

    const subjectSelect = document.querySelector("#subject");

    for (let pos of result) {
        subjectSelect.innerHTML += `<option value=${pos.id}>${pos.name}</option>`;
    }
};

const token = localStorage.getItem("token");

const form = document.querySelector(".form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const cellphone = document.querySelector("#cellphone").value;
    const birthDate = document.querySelector("#birthDate").value;

    const subjectsElement = document.querySelector("#subject");
    var selectedOptions = [];

    for (var i = 0; i < subjectsElement.options.length; i++) {
        if (subjectsElement.options[i].selected) {
            selectedOptions.push(subjectsElement.options[i].value);
        }
    }

    const res = await fetch("http://localhost:3333/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            name,
            email,
            password,
            cellphone,
            birth_date: birthDate,
            type: "teacher",
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
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ teacherId: result.typeId, subjects: selectedOptions })
        });
    }

    location.pathname = "frontend/pedagogo";
});

listSubjects();
