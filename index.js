// Updated index.js to support CSV loading from ./assets/data

const fields = ["Sakoen", "Pronunciation", "Part of speech", "English"];
const table = document.getElementById("results");
const input = document.getElementById("searchbar");
let entries = [];

document.getElementById("glossaryBtn").addEventListener("click", () => window.open("glossary.html", "_self"));
document.getElementById("wsystemsBtn").addEventListener("click", () => window.open("wsystems.html", "_self"));

window.addEventListener("load", () => {
    input.value = "";
    input.focus();
    loadCSV("./assets/data/sakoen.csv");
});

input.addEventListener("keyup", () => loadTable());

function loadCSV(path) {
    fetch(path)
        .then(response => response.text())
        .then(text => {
            entries = parseCSV(text);
            loadTable();
        });
}

function parseCSV(data) {
    const [header, ...lines] = data.trim().split("\n").map(line => line.split(","));
    return lines.map(row => Object.fromEntries(header.map((col, i) => [col, row[i]])));
}

function loadTable() {
    table.innerHTML = "";
    if (input.value.trim() !== "") {
        table.style.display = "";
        const filteredEntries = [...new Set(entries.filter(entry => fields.some(field => (entry[field] || "").toLowerCase().includes(input.value.trim().toLowerCase()))))];
        if (filteredEntries.length === 0) {
            table.insertRow().insertCell().innerHTML = "No entries matching \"" + input.value.trim() + "\" found.";
        }
        filteredEntries.forEach(entry => {
            table.insertRow().insertCell().innerHTML = format(entry);
        });
    } else {
        table.style.display = "none";
    }
}

function format(entry) {
    const format = document.createElement("div");
    addElement("h3", capitalizeFirst(entry["Sakoen"]), format);
    addElement("p", entry["Pronunciation"], format);
    addElement("b", "English translation: ", format);
    addElement("i", entry["English"], format);
    format.appendChild(document.createElement("br"));
    addElement("b", "Part of speech: ", format);
    addElement("small", capitalizeFirst(entry["Part of speech"]), format);
    format.appendChild(document.createElement("br"));
    format.appendChild(document.createElement("br"));
    return format.innerHTML;
}

function capitalizeFirst(str) {
    try {
        return str.charAt(0).toUpperCase() + str.slice(1);
    } catch (error) {
        return "";
    }
}

function addElement(element, textContent, dest) {
    const child = document.createElement(element);
    child.textContent = textContent;
    dest.appendChild(child);
} 