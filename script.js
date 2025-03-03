// 📌 Import Firebase SDK (Add this in your HTML file before your script.js)
document.write('<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"></script>');
document.write('<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js"></script>');

// 🔥 Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1vjsSaYjUOj4S3FVEXhVfZLSwNMoOYTg",
    authDomain: "viivaa-fc0e1.firebaseapp.com",
    databaseURL: "https://viivaa-fc0e1-default-rtdb.firebaseio.com",
    projectId: "viivaa-fc0e1",
    storageBucket: "viivaa-fc0e1.appspot.com",
    messagingSenderId: "629736113572",
    appId: "1:629736113572:web:2b558513c388c860156d31"
};

// 🔗 Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 📡 Reference to Firebase Database
const database = firebase.database();
const soilMoistureRef = database.ref("/soilMoisture");
const lastUpdatedRef = database.ref("/lastUpdated");

// 📈 Initialize Moisture Chart
const ctx = document.getElementById("moistureChart").getContext("2d");
const moistureChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [], // Stores time labels
        datasets: [{
            label: "Soil Moisture (%)",
            data: [],
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            borderColor: "rgba(76, 175, 80, 1)",
            borderWidth: 2,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: { 
                    display: true, 
                    text: "Time",
                    font: { size: 14, weight: "bold" }
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    padding: 5 // Prevents overlap
                },
                grid: {
                    drawOnChartArea: false // Hides grid behind labels
                }
            },
            y: { 
                min: 0, 
                max: 100, 
                title: { display: true, text: "Moisture Level (%)" } 
            }
        },
        layout: {
            padding: {
                bottom: 30 // Moves time labels inside the white box
            }
        },
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    boxWidth: 15,
                    font: { size: 12 }
                }
            }
        }
    }
});

// 📊 Listen for Real-time Changes
soilMoistureRef.on("value", (snapshot) => {
    if (!snapshot.exists()) {
        console.error("No data received from Firebase.");
        return;
    }
    
    const data = snapshot.val();
    document.getElementById("moisture").innerText = data + "%";

    // Get Current Time (HH:MM:SS)
    const now = new Date().toLocaleTimeString();

    // Maintain Only 10 Data Points
    if (moistureChart.data.labels.length >= 10) {
        moistureChart.data.labels.shift();
        moistureChart.data.datasets[0].data.shift();
    }

    // Add New Data to Chart
    moistureChart.data.labels.push(now);
    moistureChart.data.datasets[0].data.push(data);
    moistureChart.update();

    // 🔄 Auto-Irrigation Logic
    if (data < 30) {
        toggleIrrigation(true);
        showNotification("⚠️ Soil is too dry! Automatically turning on irrigation.");
    } else if (data > 60) {
        toggleIrrigation(false);
    }
});

// ⏰ Fetch and Display Last Updated Time
lastUpdatedRef.on("value", (snapshot) => {
    if (!snapshot.exists()) {
        document.getElementById("last-updated").innerText = "-";
        return;
    }

    const timestamp = snapshot.val();
    const date = new Date(timestamp);
    document.getElementById("last-updated").innerText = date.toLocaleString();
});

// 💦 Toggle Irrigation System
function toggleIrrigation(state) {
    database.ref("/Irrigation").set(state).then(() => {
        database.ref("/lastUpdated").set(Date.now());
        alert("Irrigation turned " + (state ? "ON" : "OFF"));
    }).catch((error) => {
        console.error("Error updating irrigation:", error);
    });
}

// 📢 Show Notification
function showNotification(message) {
    var notification = document.getElementById("notification");
    notification.innerHTML = `<p>${message}</p>
        <button onclick="toggleIrrigation(true)">Water Now</button>
        <button onclick="dismissNotification()">Dismiss</button>`;
    notification.style.display = "block";
}

// ❌ Dismiss Notification
function dismissNotification() {
    document.getElementById("notification").style.display = "none";
}

// ✅ Connection Test
firebase.database().ref(".info/connected").on("value", (snapshot) => {
    if (snapshot.val() === true) {
        console.log("✅ Firebase connected.");
    } else {
        console.error("❌ Firebase not connected.");
    }
});
