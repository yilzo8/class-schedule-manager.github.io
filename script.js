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

// 強制請求通知權限
function requestNotificationPermission() {
    console.log("目前通知權限:", Notification.permission);
    if (Notification.permission === "default" || Notification.permission === "denied") {
        Notification.requestPermission().then(permission => {
            console.log("用戶授予的通知權限:", permission);
            if (permission === "granted") {
                console.log("通知權限已授予");
            } else {
                alert("請在瀏覽器設定中啟用通知權限！");
            }
        });
    } else if (Notification.permission === "granted") {
        console.log("通知權限已經授予");
    }
}

// 註冊邏輯
document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(user => user.username === username)) {
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
    const user = users.find(user => user.username === username);

    if (!user) {
        alert("帳號不存在！");
    } else if (user.password !== password) {
        alert("密碼錯誤！");
    } else {
        alert("登入成功！");
        loginPage.classList.add("hidden");
        coursePage.classList.remove("hidden");
        requestNotificationPermission();
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
    const time = new Date(document.getElementById("course-time").value);
    const reminderTime = parseInt(document.getElementById("reminder-time").value);

    const now = new Date();
    if (isNaN(reminderTime) || reminderTime <= 0) {
        alert("提醒時間必須是正數！");
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

// 設置通知提醒
function setReminder(name, time, reminderTime) {
    const now = new Date();
    const triggerTime = new Date(time.getTime() - reminderTime * 60000);
    const timeDifference = triggerTime - now;

    console.log(`設定提醒: 課程名稱: ${name}, 剩餘時間差 (毫秒): ${timeDifference}`);

    if (timeDifference > 0) {
        setTimeout(() => {
            if (Notification.permission === "granted") {
                new Notification("課程提醒", {
                    body: `您的課程 "${name}" 即將開始！`,
                    icon: "./icon.png" // 圖示路徑
                });
                console.log("提醒通知已發送！");
            } else {
                alert(`提醒: 您的課程 "${name}" 即將開始！`);
            }
        }, timeDifference);
    }
}

// 載入課程
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

// 測試通知按鈕
document.addEventListener("DOMContentLoaded", () => {
    requestNotificationPermission();
    loadCourses();

    const testButton = document.createElement("button");
    testButton.textContent = "測試通知";
    testButton.style.padding = "10px";
    testButton.style.backgroundColor = "#007BFF";
    testButton.style.color = "#FFF";
    document.body.appendChild(testButton);

    testButton.addEventListener("click", () => {
        if (Notification.permission === "granted") {
            new Notification("測試通知", {
                body: "這是一個測試通知！",
                icon: "./icon.png"
            });
            console.log("測試通知已發送！");
        } else {
            alert("通知權限未授予，請啟用通知權限！");
        }
    });
});
