// 切換頁面邏輯
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

// 強制請求通知權限
function requestNotificationPermission() {
    if (Notification.permission === "default" || Notification.permission === "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("通知權限已授予");
            } else {
                alert("請授予通知權限以使用提醒功能！");
            }
        });
    }
}

// 測試通知功能
document.addEventListener("DOMContentLoaded", () => {
    const testBtn = document.createElement("button");
    testBtn.textContent = "測試通知";
    testBtn.style = "position:fixed; bottom:50%; right:2%; background-color:blue; color:white; padding:10px; border-radius:5px;";
    testBtn.addEventListener("click", () => {
        if (Notification.permission === "granted") {
            new Notification("測試通知", {
                body: "這是一個測試通知！",
                icon: "icon.png"
            });
            console.log("測試通知已發送！");
        } else {
            requestNotificationPermission();
        }
    });
    document.body.appendChild(testBtn);
});

// 註冊邏輯
document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value.trim();

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

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

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
        requestNotificationPermission();
        loadCourses();
    }
});

// 登出邏輯
document.getElementById("logout-btn").addEventListener("click", () => {
    coursePage.classList.add("hidden");
    loginPage.classList.remove("hidden");
});

// 課程新增邏輯
document.getElementById("course-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("course-name").value.trim();
    const location = document.getElementById("course-location").value.trim();
    const time = new Date(document.getElementById("course-time").value);
    const reminderTime = parseInt(document.getElementById("reminder-time").value);

    if (isNaN(reminderTime) || reminderTime <= 0) {
        alert("提醒時間必須是正數！");
        return;
    }

    const now = new Date();
    if (time <= now) {
        alert("課程時間必須是未來時間！");
        return;
    }

    const timeDifference = time.getTime() - now.getTime() - reminderTime * 60000;
    if (timeDifference <= 0) {
        alert("提醒時間過短，無法設置提醒！");
        return;
    }

    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    courses.push({ name, location, time: time.toISOString(), reminderTime });
    localStorage.setItem("courses", JSON.stringify(courses));

    loadCourses();
    setReminder(name, time, reminderTime);
});

// 設置課程提醒
function setReminder(name, time, reminderTime) {
    const now = new Date();
    const timeDifference = time.getTime() - now.getTime() - reminderTime * 60000;

    if (timeDifference > 0) {
        setTimeout(() => {
            if (Notification.permission === "granted") {
                new Notification("課程提醒", {
                    body: `您的課程 "${name}" 即將開始！`,
                    icon: "icon.png"
                });
            } else {
                alert(`提醒: 您的課程 "${name}" 即將開始！`);
            }
        }, timeDifference);
    }
}

// 載入課程列表
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

// 頁面加載時初始化
document.addEventListener("DOMContentLoaded", () => {
    requestNotificationPermission();
    loadCourses();
});
