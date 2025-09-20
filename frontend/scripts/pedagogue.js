const listTeacher = async () => {
    const res = await fetch("http://localhost:3333/teachers");
    const result = await res.json();

    if (!res.ok) {
        return;
    }

    const teachers = document.querySelector(".teachers");
    for (let pos of result) {
        teachers.innerHTML += `
            <div class="teacher">
                            <a href="./professor.html?id=${pos.id}">
                                <span>${pos.name}</span>
                                <span>${pos.email}</span>
                                <span>${pos.cellphone}</span>
                            </a>
                        </div>
        `;
    }
};

const listStudent = async () => {
    const res = await fetch("http://localhost:3333/students");
    const result = await res.json();

    if (!res.ok) {
        return;
    }

    const teachers = document.querySelector(".students");
    for (let pos of result) {
        teachers.innerHTML += `
            <div class="student">
                            <a href="./aluno.html?id=${pos.id}">
                                <span>${pos.name}</span>
                                <span>${pos.email}</span>
                                <span>${pos.cellphone}</span>
                            </a>
                        </div>
        `;
    }
};

const listPedagogues = async () => {
    const res = await fetch("http://localhost:3333/pedagogues");
    const result = await res.json();

    if (!res.ok) {
        return;
    }

    const teachers = document.querySelector(".pedagogues");
    for (let pos of result) {
        teachers.innerHTML += `
            <div class="student">
                            <a href="./pedagogo.html?id=${pos.id}">
                                <span>${pos.name}</span>
                                <span>${pos.email}</span>
                                <span>${pos.cellphone}</span>
                            </a>
                        </div>
        `;
    }
};

const listClasses = async () => {
    const res = await fetch("http://localhost:3333/classes");
    const result = await res.json();

    if (!res.ok) {
        return;
    }

    const classes = document.querySelector(".classes");
    for (let pos of result) {
        const shiftTranslate = {
            morning: "Manhã",
            afternoon: "Tarde",
            night: "Noite"
        }
        classes.innerHTML += `
            <div class="class">
                <a href="./turma.html?id=${pos.id}">
                    <span>${pos.name}</span>
                    <span>${pos.grade_level}° Ano</span>
                    <span>${shiftTranslate[pos.shift]}</span>
                    <span>${pos.creation_year}</span>
                </a>
            </div>
        `;
    }
};

listTeacher();
listStudent();
listPedagogues();
listClasses();