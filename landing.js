var db = firebase.firestore();
var settings = { timestampsInSnapshots: true };
db.settings(settings);
var auth = firebase.auth();

auth.onAuthStateChanged(function (user) {
  if (!user) {
    window.location = "index.html";
  } else {
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.exists) {
          const type = querySnapshot.data().type;
          if (type == 2) {
            window.location = "recordAttendance.html";
          } else {
            displayProfile();
            loadAttendance(user.uid);
          }
        } else {
          auth
            .signOut()
            .then(() => {
              window.location = "index.html";
            })
            .catch((error) => {
              console.error("Error signing out:", error);
            });
        }
      });
  }
});

function displayProfile() {
  const user = auth.currentUser;
  document.getElementById("username").textContent = "Name: " + user.displayName;
  document.getElementById("useremail").textContent = "Email: " + user.email;
}

function loadAttendance(employeeId) {
  db.collection("employee")
    .doc(employeeId)
    .get()
    .then((querySnapshot) => {
      const employeeTableBody = document.getElementById("employeeTableBody");
      employeeTableBody.innerHTML = "";

      if (querySnapshot.exists) {
        const employee = querySnapshot.data();
        const employeeId = querySnapshot.id;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${employeeId}</td>
          <td>${employee.name}</td>
          <td>${employee.email}</td>
          <td id="checkin-${employeeId}">Loading...</td>
        `;
        employeeTableBody.appendChild(row);
        fetchCheckInTime(employeeId);
        auth.currentUser.updateProfile({ displayName: employee.name });
      } else {
        alert("No data found. Contact your manager.");
      }
    })
    .catch((error) => {
      console.error("Error loading details:", error);
    });
}

function fetchCheckInTime(employeeId) {
  const today = new Date().toISOString().split("T")[0];
  db.collection("attendance")
    .doc(employeeId)
    .collection("records")
    .doc(today)
    .get()
    .then((querySnapshot) => {
      let checkInTime = "Not checked in";
      if (querySnapshot.exists) {
        checkInTime = querySnapshot.data().checkInTime;
      } else {
        checkInTime = "Not Available";
      }
      document.getElementById(`checkin-${employeeId}`).textContent =
        checkInTime;
    })
    .catch((error) => {
      console.error("Error fetching check-in time:", error);
    });
}

function logout() {
  auth
    .signOut()
    .then(() => {
      window.location = "index.html";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}
