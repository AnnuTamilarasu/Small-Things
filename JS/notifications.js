// Request permission on page load
document.addEventListener("DOMContentLoaded", () => {
  if ("Notification" in window) {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }
});

function sendNotification(title, message) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: message,
      icon: "icons/bell.png"  // optional
    });
  }
}

function dailyMoodReminder() {
  const lastShown = localStorage.getItem("lastMoodReminder");
  const today = new Date().toDateString();

  if (lastShown !== today) {
    sendNotification("How are you feeling today?", "Check in with yourself ❤️");
    localStorage.setItem("lastMoodReminder", today);
  }
}

dailyMoodReminder();

