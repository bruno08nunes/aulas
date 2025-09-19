import { populateMonthSelect, render } from "./utils/rollCall.js";
import { state } from "./utils/consts.js";

const monthSelect = document.getElementById("monthSelect");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

const getMe = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3333/me", {
        headers: {
            "Authorization": "Bearer " + token
        },
    });
    const result = await res.json();
    console.log(result);
}

prevBtn.addEventListener("click", () => {
    const currentYear = new Date().getFullYear();
    
    if (state.month === 0 && state.year < currentYear - 1) {
        return;
    }

    state.month -= 1;
    if (state.month < 0) {
        state.month = 11;
        state.year -= 1;
    }
    render();
});

nextBtn.addEventListener("click", () => {
    const currentYear = new Date().getFullYear();
    if (state.month === 11 && state.year === currentYear) {
        return;
    }
    
    state.month += 1;
    if (state.month > 11) {
        state.month = 0;
        state.year += 1;
    }
    render();
});

monthSelect.addEventListener("change", (e) => {
    const [y, m] = e.target.value.split("-").map(Number);
    state.year = y;
    state.month = m;
    render();
});

populateMonthSelect();
render();
getMe();