var db = firebase.firestore();
var settings = { timestampsInSnapshots: true };
db.settings(settings);
var auth = firebase.auth();

auth.onAuthStateChanged(function (user) {
  if (!user) {
    window.location = "index.html";
  } else {
    loadEmployees();
    // loadManagers();
  }
});

let managerDetails = {};

function loadEmployees() {
  fetchManagerName();
  db.collection("employee")
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
          <td>${managerDetails[employee.managerId]}</td>
        `;
        employeeTableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error loading employees:", error);
    });
}


function fetchManagerName(){
  db.collection("manager").get().then((querySnapshots)=>{
    querySnapshots.forEach((doc) => {
      managerDetails[doc.id] = doc.data().name;
    });
  });
}


function displayProfile() {
  const user = auth.currentUser;
  document.getElementById("username").textContent = "Name: " + user.displayName;
  document.getElementById("useremail").textContent = "Email: " + user.email;
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
