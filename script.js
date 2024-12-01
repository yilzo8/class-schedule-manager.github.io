// 切換頁面
const loginPage = document.getElementById("login-page");
const signupPage = document.getElementById("signup-page");
const coursePage = document.getElementById("course-page");

document.getElementById("to-signup").addEventListener("click", () => {
    loginPage.classList.add("hidden");
    signupPage.classList.remove("hidden");
});

document.getElementById("to-login").addEventListener("click", () => {
    signupPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
});

// 註冊邏輯
document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((user) => user.username === username)) {
        alert("帳號已存在！");
    } else {
        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("註冊成功！");
        signupPage.classList.add("hidden");
        loginPage.classList.remove("hidden");
    }
});

// 登入邏輯
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((user) => user.username === username);

    if (!user) {
        alert("帳號不存在！");
    } else if (user.password !== password) {
        alert("密碼錯誤！");
    } else {
        alert("登入成功！");
        loginPage.classList.add("hidden");
        coursePage.classList.remove("hidden");
    }
});

// 登出邏輯
document.getElementById("logout-btn").addEventListener("click", () => {
    coursePage.classList.add("hidden");
    loginPage.classList.remove("hidden");
});

// 課程邏輯
document.getElementById("course-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("course-name").value;
    const location = document.getElementById("course-location").value;
    const time = document.getElementById("course-time").value;
    const reminderTime = parseInt(document.getElementById("reminder-time").value);

    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    courses.push({ name, location, time, reminderTime });
    localStorage.setItem("courses", JSON.stringify(courses));
    loadCourses();
});

function loadCourses() {
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const courseList = document.getElementById("course-list");
    courseList.innerHTML = "";

    courses.forEach((course, index) => {
        const li = document.createElement("li");
        li.textContent = `${course.name} - ${course.location} - ${new Date(course.time).toLocaleString()}`;
        const delBtn = document.createElement("button");
        delBtn.textContent = "刪除";
        delBtn.addEventListener("click", () => {
            courses.splice(index, 1);
            localStorage.setItem("courses", JSON.stringify(courses));
            loadCourses();
        });
        li.appendChild(delBtn);
        courseList.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", loadCourses);
