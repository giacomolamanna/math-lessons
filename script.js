document.addEventListener("DOMContentLoaded", loadLessons);

function addLesson() {
    let today = new Date();
    let day = today.toLocaleDateString('it-IT', { weekday: 'long' });
    let date = today.toLocaleDateString('it-IT');

    addRow(day, date, "", "");
    saveLessons();
}

function addRow(day, date, startTime, endTime) {
    let table = document.getElementById("lessonTable").getElementsByTagName('tbody')[0];
    let row = table.insertRow();

    row.innerHTML = `
        <td>${day}</td>
        <td>${date}</td>
        <td><input type="time" value="${startTime}"></td>
        <td><input type="time" value="${endTime}"></td>
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

function addLesson() {
    let dateInput = document.getElementById("manualDate").value;
    let today = new Date();
    
    let selectedDate = dateInput ? new Date(dateInput) : today;
    let day = selectedDate.toLocaleDateString('it-IT', { weekday: 'long' });
    let date = selectedDate.toLocaleDateString('it-IT');

    addRow(day, date, "", "");
    saveLessons();
}

function saveAsPDF() {
    html2canvas(document.querySelector("#lessonTable")).then(canvas => {
        let imgData = canvas.toDataURL("image/png");
        let pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
        pdf.save("registro_lezioni.pdf");
    });
}

function saveAsImage() {
    html2canvas(document.querySelector("#lessonTable")).then(canvas => {
        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "registro_lezioni.png";
        link.click();
    });
}
