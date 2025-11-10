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
            displayProfile();
            loadEmployees(user.uid);
          } else {
            window.location = "landing.html";
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

function loadEmployees(managerId) {
  db.collection("employee")
    .where("managerId", "==", managerId)
    .get()
    .then((querySnapshot) => {
      const employeeTableBody = document.getElementById("employeeTableBody");
      employeeTableBody.innerHTML = "";
      querySnapshot.forEach((doc) => {
        const employee = doc.data();
        const employeeId = doc.id;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${employeeId}</td>
          <td>${employee.name}</td>
          <td>${employee.email}</td>
          <td id="checkin-${employeeId}">Loading...</td>
          <td><button class="btn btn-primary" onclick="editCheckIn('${employeeId}')">Edit Check-in</button></td>
        `;
        employeeTableBody.appendChild(row);

        // Fetch check-in time
        fetchCheckInTime(employeeId);
      });
    })
    .catch((error) => {
      console.error("Error loading employees:", error);
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

function editCheckIn(employeeId) {
  const newCheckInTime = prompt("Enter new check-in time (HH:MM AM/PM):");
  if (newCheckInTime) {
    const today = new Date().toISOString().split("T")[0];
    db.collection("attendance")
      .doc(employeeId)
      .collection("records")
      .doc(today)
      .set({
        checkInTime: newCheckInTime,
      })
      .then(() => {
        fetchCheckInTime(employeeId);
        alert("Check-in time updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating check-in time:", error);
        alert("Failed to update check-in time.");
      });
  }
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
