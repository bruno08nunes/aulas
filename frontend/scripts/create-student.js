const getClasses = async () => {
    const res = await fetch("http://localhost:3333/classes");
    const result = await res.json();

    const classes = document.querySelector("#class");
    for (let pos of result) {
        classes.innerHTML += `<option value=${pos.id}>${pos.name}</option>`
    }
}

getClasses();

const token = localStorage.getItem("token");

const form = document.querySelector(".form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const cellphone = document.querySelector("#cellphone").value;
    const birthDate = document.querySelector("#birthDate").value;
    const registration = document.querySelector("#registration").value;

    const classElement = document.querySelector("#class");
    var selectedOptions = [];

    for (var i = 0; i < classElement.options.length; i++) {
        if (classElement.options[i].selected) {
            selectedOptions.push(classElement.options[i].value);
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
            registration,
            type: "student"
        }),
    });
    const result = await res.json();
    
    if (!res.ok) {
        alert("Erro");
        return;
    }

    if (selectedOptions.length) {
       await fetch("http://localhost:3333/students/sync", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ studentId: result.typeId, classes: selectedOptions })
        });
    }

    location.pathname = "frontend/pedagogo";
});
