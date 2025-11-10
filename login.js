var db = firebase.firestore();
var settings = { timestampsInSnapshots: true };
db.settings(settings);
var auth = firebase.auth();

auth.onAuthStateChanged((user) => {
  sendUserToHome(user);
});

function login() {
  var loginButton = document.getElementById("btnLogIn");
  var emailTxt = document.getElementById("email");
  var passwordTxt = document.getElementById("password");
  loginButton.disabled = true;
  loginButton.innerHTML =
    '<i class="fa fa-spinner fa-spin" style="font-size:20px"></i>' +
    " Verifying...";
  var email = emailTxt.value;
  var password = passwordTxt.value;

  if (/^\S+@\S+\.\S+$/.test(email)){
    if (/^.{8,}$/.test(password)){
      try {
        auth.signInWithEmailAndPassword(email, password);
        auth.onAuthStateChanged((user) => {
          sendUserToHome(user);
        });
      } catch (error) {
        console.log(error);
      }
    }
    else {
      alert("Enter correct password!");
    }
  }
  else {
    alert("Enter correct email!");
  };
}

function sendUserToHome(user) {
  if (user) {
    if (user.email == 'superadmin@nhpc.in'){
      window.location = "superAdmin.html";
    } else{
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
  }
}