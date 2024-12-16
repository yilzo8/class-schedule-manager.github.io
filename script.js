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

// 請求通知權限
function requestNotificationPermission() {
    if (Notification.permission === "default" || Notification.permission === "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("通知權限已授予");
            } else {
                alert("請在瀏覽器設定中啟用通知權限，否則無法使用提醒功能！");
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
        console.log("儲存的使用者資料:", users);
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

    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    courses.push({ name, location, time: time.toISOString(), reminderTime });
    localStorage.setItem("courses", JSON.stringify(courses));
    alert("課程已新增！");
    loadCourses();
    setReminder(name, time, reminderTime);
});

// 設置提醒通知
function setReminder(name, time, reminderTime) {
    const now = new Date();
    const reminderMilliseconds = reminderTime * 60000; // 轉換提醒時間為毫秒
    const triggerTime = new Date(time - reminderMilliseconds);

    if (triggerTime > now) {
        const timeDifference = triggerTime - now;
        console.log(`提醒時間設定於: ${triggerTime.toLocaleString()}`);
        setTimeout(() => {
            if (Notification.permission === "granted") {
                new Notification("課程提醒", {
                    body: `您的課程 "${name}" 即將開始！`,
                    icon: "icon.png" // 使用本地圖片
                });
                console.log("提醒通知已發送！");
            } else {
                alert(`提醒: 您的課程 "${name}" 即將開始！`);
            }
        }, timeDifference);
    } else {
        alert("提醒時間過短，無法設置通知！");
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
        delBtn.classList.add("btn");
        delBtn.addEventListener("click", () => {
            courses.splice(index, 1);
            localStorage.setItem("courses", JSON.stringify(courses));
            loadCourses();
        });
        li.appendChild(delBtn);
        courseList.appendChild(li);
    });
}

// 初始化頁面
document.addEventListener("DOMContentLoaded", () => {
    requestNotificationPermission();
    loadCourses();
});
console.log("測試通知程式碼執行中...");
const img = new Image();
img.src = "icon.png";
img.onload = () => console.log("icon.png 成功加載");
img.onerror = () => console.error("icon.png 無法加載，請檢查路徑");
document.addEventListener("DOMContentLoaded", () => {
    const testBtn = document.createElement("button");
    testBtn.textContent = "測試通知";
    testBtn.style.padding = "10px";
    testBtn.style.marginTop = "20px";
    testBtn.style.backgroundColor = "#007BFF";
    testBtn.style.color = "white";
    document.body.appendChild(testBtn);

    testBtn.addEventListener("click", () => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("測試通知", {
                        body: "這是一個測試通知，證明通知功能可用。",
                        icon: "icon.png"
                    });
                    console.log("測試通知已發送！");
                } else {
                    alert("通知權限未啟用！");
                }
            });
        } else {
            new Notification("測試通知", {
                body: "這是一個測試通知，證明通知功能可用。",
                icon: "icon.png"
            });
            console.log("測試通知已發送！");
        }
    });
});

