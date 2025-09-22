const classId = new URLSearchParams(location.search).get("id");
const token = localStorage.getItem("token");

const getClass = async () => {
    const res = await fetch("http://localhost:3333/classes/" + classId);
    const result = await res.json();

    document.querySelector("#name").value = result.name;
    document.querySelector("#shift").value = result.shift;
    document.querySelector("#grade_level").value = result.grade_level;
};

document
    .querySelector(".delete-button")
    ?.addEventListener("click", async () => {
        const res = await fetch("http://localhost:3333/classes/" + classId, {
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

document.querySelector(".form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const shift = document.querySelector("#shift").value;
    const grade_level = document.querySelector("#grade_level").value;

    const res = await fetch("http://localhost:3333/classes/" + classId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ name, shift, grade_level }),
    });

    if (!res.ok) {
        alert("Erro");
        return;
    }

    location.pathname = "frontend/pedagogo";
});

getClass();
