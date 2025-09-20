const form = document.querySelector(".form");

const listSchools = async () => {
    const res = await fetch("http://localhost:3333/schools");
    const result = await res.json();
    
    const schoolSelect = document.querySelector("#school");
    for (const school of result) {
        schoolSelect.innerHTML += `<option value="${school.id}">${school.name}</option>`
    }
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const school_id = document.querySelector("#school").value;
    const shift = document.querySelector("#shift").value;
    const grade_level = document.querySelector("#grade_level").value;

    const res = await fetch("http://localhost:3333/classes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            school_id,
            shift,
            grade_level,
        }),
    });

    if (!res.ok) {
        alert("Erro");
    }
    
    location.pathname = "frontend/pedagogo";
});

listSchools()