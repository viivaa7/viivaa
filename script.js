// 🔥 Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "viivaa-fc0e1.firebaseapp.com",
    databaseURL: "https://viivaa-fc0e1-default-rtdb.firebaseio.com",
    projectId: "viivaa-fc0e1",
    storageBucket: "viivaa-fc0e1.appspot.com",
    messagingSenderId: "629736113572",
    appId: "YOUR_APP_ID"
};

// 🔗 Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 📡 Reference Firebase Database
const database = firebase.database();
const soilMoistureRef = database.ref("/soilMoisture");

// 📈 Chart Setup
const ctx = document.getElementById("moistureChart").getContext("2d");
const moistureChart = new Chart(ctx, {
    type: "line",
    data: { labels: [], datasets: [{ label: "Soil Moisture (%)", data: [], borderColor: "green", borderWidth: 2 }] },
    options: { scales: { y: { min: 0, max: 100 } } }
});

// 🔄 Real-time Data Updates
soilMoistureRef.on("value", (snapshot) => {
    const data = snapshot.val();
    document.getElementById("moisture").innerText = data + "%";
    moistureChart.data.labels.push(new Date().toLocaleTimeString());
    moistureChart.data.datasets[0].data.push(data);
    moistureChart.update();
});

// 💦 Toggle Irrigation
function toggleIrrigation(state) {
    database.ref("/Irrigation").set(state);
    alert("Irrigation turned " + (state ? "ON" : "OFF"));
}
