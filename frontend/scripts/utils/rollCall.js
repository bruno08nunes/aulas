import { monthNames, schedule, weekNames, state } from "./consts.js";

const monthLabel = document.getElementById("monthLabel");
const monthSelect = document.getElementById("monthSelect");
const tbody = document.querySelector("#attendanceTable tbody");
const totalDaysEl = document.getElementById("totalDays");
const presentCountEl = document.getElementById("presentCount");
const absentCountEl = document.getElementById("absentCount");

export function populateMonthSelect() {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 2; y <= currentYear + 1; y++) {
        for (let m = 0; m < 12; m++) {
            const opt = document.createElement("option");
            opt.value = `${y}-${m}`;
            opt.textContent = `${monthNames[m]} ${y}`;
            monthSelect.appendChild(opt);
        }
    }
}

function getYearMonthKey(year, month) {
    return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function generateAttendanceByState() {
    const key = getYearMonthKey(state.year, state.month);
    if (!state.attendance[key]) {
        const n = daysInMonth(state.year, state.month);
        state.attendance[key] = [];
        for (let d = 0; d < n; d++) {
            const weekday = new Date(state.year, state.month, d + 1).getDay();
            if (schedule[weekday]) {
                state.attendance[key][d] = schedule[weekday].map(
                    () => Math.random() > 0.1
                );
            } else {
                state.attendance[key][d] = null;
            }
        }
    }
}

function generateTableRows({ daysAmount, attendanceMonthDays }) {
    const today = new Date();
    let present = 0;
    let absent = 0;

    for (let d = 1; d <= daysAmount; d++) {
        const weekday = new Date(state.year, state.month, d).getDay();
        const tr = document.createElement("tr");

        const tdDay = document.createElement("td");
        tdDay.textContent = d;

        const tdWeek = document.createElement("td");
        tdWeek.textContent = weekNames[weekday];

        tr.appendChild(tdDay);
        tr.appendChild(tdWeek);

        const periods = attendanceMonthDays[d - 1];
        const dateObj = new Date(state.year, state.month, d);
        const future = dateObj > today;
        const isWeekend = !periods;

        if (!isWeekend) {
            periods.forEach((isPresent, i) => {
                const td = document.createElement("td");

                if (future) {
                    td.innerHTML = `<div>${schedule[weekday][i]}</div><div class="status undefined">Indefinido</div>`;
                } else {
                    td.innerHTML = `
                    <div>${schedule[weekday][i]}</div>
                    <div
                        class="status ${isPresent ? "present" : "absent"}"
                    >
                        ${isPresent ? "Presente" : "Faltou"}
                    </div>`;

                    if (isPresent) {
                        present++;
                    } else {
                        absent++;
                    }
                }

                tr.appendChild(td);
            });
        }

        if (isWeekend) {
            for (let i = 0; i < 4; i++) {
                const td = document.createElement("td");
                td.textContent = "-";
                td.classList.add("weekend");
                tr.appendChild(td);
            }
        }

        tbody.appendChild(tr);
    }

    return { present, absent };
}

export function render() {
    generateAttendanceByState();
    const key = getYearMonthKey(state.year, state.month);
    const attendanceMonthDays = state.attendance[key];
    const daysAmount = attendanceMonthDays.length;

    monthLabel.textContent = `${monthNames[state.month]} ${state.year}`;
    monthSelect.value = `${state.year}-${state.month}`;
    totalDaysEl.textContent = daysAmount;

    tbody.innerHTML = "";

    const { present, absent } = generateTableRows({
        daysAmount,
        attendanceMonthDays,
    });

    presentCountEl.textContent = present;
    absentCountEl.textContent = absent;
}
