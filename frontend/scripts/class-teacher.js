const gradesBtn = document.getElementById("gradeBtn");
const attendanceBtn = document.getElementById("attendanceBtn");

const gradesSection = document.getElementById("gradesSection");
const attendanceSection = document.getElementById("attendanceSection");

gradesBtn.addEventListener("click", () => {
    gradesBtn.classList.add("active");
    attendanceBtn.classList.remove("active");
    gradesSection.classList.add("active");
    attendanceSection.classList.remove("active");
});

attendanceBtn.addEventListener("click", () => {
    attendanceBtn.classList.add("active");
    gradesBtn.classList.remove("active");
    attendanceSection.classList.add("active");
    gradesSection.classList.remove("active");
});

// Impede edição de datas antigas na tabela de presença
const attendanceTable = document.getElementById("attendanceTable");
const today = new Date().toISOString().split("T")[0];

const addGradeBtn = document.getElementById("addGradeBtn");
const gradesTable = document.getElementById("gradeTable");

addGradeBtn.addEventListener("click", () => {
    const theadRow = gradesTable.tHead.rows[0];
    const tbodyRows = gradesTable.tBodies[0].rows;

    // Número da nova nota
    const newNotaNumber = theadRow.cells.length; // Porque o primeiro é "Aluno"
    const newTh = document.createElement("th");
    newTh.textContent = `Nota ${newNotaNumber}`;
    theadRow.appendChild(newTh);

    // Adiciona uma célula editável para cada aluno
    for (let row of tbodyRows) {
        const newTd = document.createElement("td");
        newTd.contentEditable = "true";
        newTd.textContent = "0"; // valor inicial
        row.appendChild(newTd);
    }
});

// Função para gerar tabela de presença do mês atual
function gerarattendance() {
    const attendanceTable = document.getElementById("attendanceTable");
    const alunos = Array.from(attendanceTable.tBodies[0].rows).map(row => row.cells[0].textContent);

    // Limpa o cabeçalho existente (exceto "Aluno")
    const theadRow = attendanceTable.tHead.rows[0];
    theadRow.innerHTML = "<th>Aluno</th>";

    const tbody = attendanceTable.tBodies[0];
    tbody.innerHTML = "";

    const today = new Date();
    const mesAtual = today.getMonth();
    const anoAtual = today.getFullYear();
    const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

    // Cria cabeçalho com todos os dias do mês
    for (let d = 1; d <= diasNoMes; d++) {
        const th = document.createElement("th");
        th.textContent = d;
        theadRow.appendChild(th);
    }

    // Cria linhas para cada aluno
    for (let aluno of alunos) {
        const tr = document.createElement("tr");
        const tdAluno = document.createElement("td");
        tdAluno.textContent = aluno;
        tr.appendChild(tdAluno);

        for (let d = 1; d <= diasNoMes; d++) {
            const td = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            // Apenas o dia atual é editável
            if (d === today.getDate()) {
                checkbox.disabled = false;
            } else {
                checkbox.disabled = true;
            }

            td.appendChild(checkbox);
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }
}

// Chama a função ao carregar
gerarattendance();