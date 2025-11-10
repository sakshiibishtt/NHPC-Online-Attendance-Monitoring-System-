// Employee

var type = 1;
var _name = "EmpXY";
var _email = "enpxy@gmail.com";
var _password = "12345678";
var _managerId = "bTMKEBs4Rxe9uVLMHejyBQk45Gt2";

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
        type: 1,  
    }).then(() => {
        console.log("Document successfully written!");
        db.collection('employee').doc(id).set({
            name: _name,
            email: _email,
            managerId: _managerId,
        }).then(() => {
            console.log("Document successfully written! to Employee collection.");
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
    }).catch((error) => {
        console.error("Error writing document: ", error);
    });
}).catch((error)=>{
    console.error("Error user not created: ", error);
});