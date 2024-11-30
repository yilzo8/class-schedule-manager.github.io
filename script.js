document.addEventListener("DOMContentLoaded", function () {
    // 預先讀取課程資料
    loadCourses();

    // 處理表單提交
    document.getElementById("course-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("course-name").value;
        const location = document.getElementById("course-location").value;
        const time = new Date(document.getElementById("course-time").value);
        const reminderTime = parseInt(document.getElementById("reminder-time").value);

        if (name && location && time && reminderTime) {
            const course = { name, location, time, reminderTime };
            saveCourse(course);
            setReminder(course);
            loadCourses();
        }
    });
});

function loadCourses() {
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const courseList = document.getElementById("course-list");
    courseList.innerHTML = "";

    courses.forEach((course, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${course.name} - ${course.location} - ${course.time.toLocaleString()}</span>
            <button onclick="deleteCourse(${index})">刪除</button>
        `;
        courseList.appendChild(li);
    });
}

function saveCourse(course) {
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    courses.push(course);
    localStorage.setItem("courses", JSON.stringify(courses));
}

function deleteCourse(index) {
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    courses.splice(index, 1);
    localStorage.setItem("courses", JSON.stringify(courses));
    loadCourses();
}

function setReminder(course) {
    const timeLeft = course.time - new Date();
    const reminderTime = course.reminderTime * 60 * 1000;

    if (timeLeft > reminderTime) {
        setTimeout(() => {
            alert(`提醒: ${course.name} 即將開始！`);
            new Audio('https://www.soundjay.com/button/beep-07.wav').play();
        }, timeLeft - reminderTime);
    }
}
