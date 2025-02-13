document.addEventListener("DOMContentLoaded", loadLessons);

function addLesson() {
    let dateInput = document.getElementById("manualDate").value;
    let today = new Date();
    
    let selectedDate = dateInput ? new Date(dateInput) : today;
    let day = selectedDate.toLocaleDateString('it-IT', { weekday: 'long' });
    let date = selectedDate.toLocaleDateString('it-IT');

    addRow(day, date, "", "");
    saveLessons();
    sortTableByDate(); // Ordina subito la tabella dopo l'aggiunta
}

function addRow(day, date, startTime, endTime) {
    let table = document.getElementById("lessonTable").getElementsByTagName('tbody')[0];
    let row = table.insertRow();

    row.innerHTML = `
        <td>${day}</td>
        <td>${date}</td>
        <td><input type="time" value="${startTime}" onchange="saveLessons()"></td>
        <td><input type="time" value="${endTime}" onchange="saveLessons()"></td>
        <td><button class="delete-btn" onclick="deleteRow(this)">🗑</button></td>
    `;

    saveLessons();
    sortTableByDate(); // Ordina sempre la tabella dopo ogni modifica
}

function deleteRow(button) {
    if (confirm("Vuoi eliminare questa lezione?")) {
        let row = button.parentElement.parentElement;
        row.remove();
        saveLessons();
        sortTableByDate();
    }
}

function highlightPaymentGroups() {
    let rows = document.querySelectorAll("#lessonTable tbody tr");
    rows.forEach((row, index) => {
        row.classList.toggle("highlight", (index + 1) % 8 === 0);
    });
}

function saveLessons() {
    let lessons = [];
    document.querySelectorAll("#lessonTable tbody tr").forEach(row => {
        let cells = row.getElementsByTagName("td");
        let lesson = {
            day: cells[0].innerText,
            date: cells[1].innerText,
            startTime: cells[2].querySelector("input").value,
            endTime: cells[3].querySelector("input").value
        };
        lessons.push(lesson);
    });
    
    // Salva i dati ordinati per data
    lessons.sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));
    localStorage.setItem("lessons", JSON.stringify(lessons));

    loadLessons(); // Ricarica la tabella con l'ordine corretto
}

function loadLessons() {
    let lessons = JSON.parse(localStorage.getItem("lessons")) || [];
    let table = document.getElementById("lessonTable").getElementsByTagName('tbody')[0];
    
    // Svuota la tabella prima di ricaricarla
    table.innerHTML = "";

    lessons.forEach(lesson => {
        let row = table.insertRow();
        row.innerHTML = `
            <td>${lesson.day}</td>
            <td>${lesson.date}</td>
            <td><input type="time" value="${lesson.startTime}" onchange="saveLessons()"></td>
            <td><input type="time" value="${lesson.endTime}" onchange="saveLessons()"></td>
            <td><button class="delete-btn" onclick="deleteRow(this)">🗑</button></td>
        `;
    });

    highlightPaymentGroups();
}

function saveAsImage() {
    html2canvas(document.querySelector("#lessonTable")).then(canvas => {
        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "registro_lezioni.png";
        link.click();
    });
}
function sortTableByDate() {
    let lessons = JSON.parse(localStorage.getItem("lessons")) || [];

    // Ordina la lista in base alla data (dal più recente al più remoto)
    lessons.sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));

    localStorage.setItem("lessons", JSON.stringify(lessons));
    loadLessons(); // Ricarica la tabella con l'ordine corretto
}
