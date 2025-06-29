const table = document.getElementById("results");
const input = document.getElementById("searchbar");
const selector = document.getElementById("selector");
let entries = [];

document.getElementById("mainPageBtn").addEventListener("click", () => window.open("index.html", "_self"));
document.getElementById("wsystemsBtn").addEventListener("click", () => window.open("wsystems.html", "_self"));

window.addEventListener("load", () => {
    loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vStgau9hRu3-mCmW_Zje1n1mH-9VPyVnOJk4duYpsCXsX45nYWl-WCsXq2IXlwtq_VUw5IOvjBrLZr4/pub?gid=1974377198&single=true&output=csv");
    input.focus();
});

input.addEventListener("keyup", () => loadTable());
selector.addEventListener("mousedown", () => input.focus());

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
    const filteredEntries = input.value.trim() !== ""
        ? entries.filter(entry => (entry[selector.value] || "").toLowerCase().startsWith(input.value.trim().toLowerCase()))
        : entries;

    filteredEntries.sort((a, b) => a["Sakoen"].localeCompare(b["Sakoen"], "en"));

    if (filteredEntries.length === 0) {
        table.insertRow().insertCell().innerHTML = `No entries matching "${input.value.trim()}" found.`;
    } else {
        filteredEntries.forEach(entry => {
            table.insertRow().insertCell().innerHTML = format(entry);
        });
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
    } catch {
        return "";
    }
}

function addElement(element, textContent, dest) {
    const child = document.createElement(element);
    child.textContent = textContent;
    dest.appendChild(child);
}