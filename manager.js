// Manager

var type = 2;
var _name = "M3";
var _email = "m3@gmail.com";
var _password = "12345678";

var db = firebase.firestore();
var settings = { timestampsInSnapshots: true };
db.settings(settings);
var auth = firebase.auth();

auth.createUserWithEmailAndPassword(_email, _password).then((userCred) => {
    var user = userCred.user;
    var id = user.uid;
    user.updateProfile({
        displayName: _name,
    });
    db.collection("users").doc(id).set({
        type: 2,  
    }).then(() => {
        console.log("Document successfully written!");
        db.collection('manager').doc(id).set({
            name: _name,
            email: _email,
        }).then(() => {
            console.log("Document successfully written! to Manager collection.");
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
    }).catch((error) => {
        console.error("Error writing document: ", error);
    });
}).catch((error)=>{
    console.error("Error user not created: ", error);
});