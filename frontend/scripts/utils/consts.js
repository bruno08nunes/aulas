export const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

export const weekNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const schedule = {
    1: ["Português", "Matemática", "História", "Ciências"],
    2: ["Matemática", "Português", "Geografia", "Inglês"],
    3: ["Ciências", "Matemática", "Educação Física", "Artes"],
    4: ["História", "Português", "Matemática", "Inglês"],
    5: ["Geografia", "Matemática", "Ciências", "Português"],
};

export const state = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    attendance: {},
};