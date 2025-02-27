// 🔥 Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1vjsSaYjUOj4S3FVEXhVfZLSwNMoOYTg",
    authDomain: "viivaa-fc0e1.firebaseapp.com",
    databaseURL: "https://viivaa-fc0e1-default-rtdb.firebaseio.com",
    projectId: "viivaa-fc0e1",
    storageBucket: "viivaa-fc0e1.firebasestorage.app",
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
                type: 'time',  // ✅ Gumagamit ng time-based axis
                time: {
                    unit: 'second',
                    tooltipFormat: 'HH:mm:ss',
                    displayFormats: {
                        second: 'HH:mm:ss'
                    }
                },
                title: { display: true, text: "Time" }
            },
            y: { 
                min: 0, 
                max: 100, 
                title: { display: true, text: "Moisture Level (%)" } 
            }
        }
    }
});

// 📊 Listen for Real-time Changes
soilMoistureRef.on("value", (snapshot) => {
    const data = snapshot.val();
    document.getElementById("moisture").innerText = data + "%";

    // Get Current Time (HH:MM:SS)
    const now = new Date().toLocaleTimeString();

    // Maintain Only 10 Data Points
    if (moistureChart.data.labels.length > 10) {
        moistureChart.data.labels.shift();
        moistureChart.data.datasets[0].data.shift();
    }

    // Add New Data to Chart
    moistureChart.data.labels.push(now);
    moistureChart.data.datasets[0].data.push(data);
    moistureChart.update();

    // 🔄 Auto-Irrigation Logic
    if (data < 30) {
        toggleIrrigation(true); // Auto Turn ON
        showNotification("⚠️ Soil is too dry! Automatically turning on irrigation.");
    } else if (data > 60) {
        toggleIrrigation(false); // Auto Turn OFF
    }
});

// ⏰ Fetch and Display Last Updated Time
lastUpdatedRef.on("value", (snapshot) => {
    const timestamp = snapshot.val();
    if (timestamp) {
        const date = new Date(timestamp);
        document.getElementById("last-updated").innerText = date.toLocaleString();
    } else {
        document.getElementById("last-updated").innerText = "-";
    }
});

// 💦 Toggle Irrigation System
function toggleIrrigation(state) {
    database.ref("/Irrigation").set(state);
    database.ref("/lastUpdated").set(Date.now()); // Update timestamp when irrigation changes
    alert("Irrigation turned " + (state ? "ON" : "OFF"));
}

// 📢 Show Notification
function showNotification(message) {
    var notification = document.getElementById("notification");
    notification.innerHTML = `<p>${message}</p>
        <button onclick="toggleIrrigation(true)">Water Now</button>
        <button onclick="dismissNotification()">Dismiss</button>`;
    notification.style.display = "block";
    new Howl({ src: ['alert.mp3'] }).play();
}

// ❌ Dismiss Notification
function dismissNotification() {
    document.getElementById("notification").style.display = "none";
}
