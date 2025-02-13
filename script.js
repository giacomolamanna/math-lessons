document.addEventListener("DOMContentLoaded", loadLessons);

function addLesson() {
    let dateInput = document.getElementById("manualDate").value;
    let today = new Date();
    
    let selectedDate = dateInput ? new Date(dateInput) : today;
    let day = selectedDate.toLocaleDateString('it-IT', { weekday: 'long' });
    let date = selectedDate.toLocaleDateString('it-IT');

    addRow(day, date, "", "");
    saveLessons();
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

    highlightPaymentGroups();
    saveLessons();
}

function deleteRow(button) {
    if (confirm("Vuoi eliminare questa lezione?")) {
        let row = button.parentElement.parentElement;
        row.remove();
        saveLessons();
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
    localStorage.setItem("lessons", JSON.stringify(lessons));
}

function loadLessons() {
    let lessons = JSON.parse(localStorage.getItem("lessons"));
    if (lessons) {
        lessons.forEach(lesson => {
            addRow(lesson.day, lesson.date, lesson.startTime, lesson.endTime);
        });
    }
}
