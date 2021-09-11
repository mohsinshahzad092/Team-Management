//.....................GET DATA......................
const userName = document.getElementById("fname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const signupBtn = document.getElementById("signupBtn");
const signinBtn = document.getElementById("signinBtn");

const loginUser = document.getElementById("loginid");
const loginpassword = document.getElementById("loginpassword");
let currentDate = document.getElementById("start");

// console.log(currentDate);

// ...............{SIGNUP}.............

function signUp() {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email.value, password.value)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;

      const uid = user.uid;

      const signupData = {
        userName: userName.value,
        email: email.value,
        password: password.value,
        key: uid,
      };

      firebase.database().ref(`users/${uid}`).set(signupData);

      console.log("dasa");

      setTimeout(() => {
        location.href = "signin.html";
      }, 2000);
    })

    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);

      // ..
    });
}

// function signUp() {
//   let users = JSON.parse(localStorage.getItem("users")) || [];

//   localStorage.setItem("user", JSON.stringify(users));

//   userdetails = {
//     userName: userName.value,
//     email: email.value,
//     password: password.value,
//   };

//   users.push(userdetails);

//   localStorage.setItem("users", JSON.stringify(users));
//   location.href = "signin.html";
// }

//....................{SIGN_IN}..........................
function signin() {
  firebase
    .auth()
    .signInWithEmailAndPassword(loginUser.value, loginpassword.value)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log(user);
      location.href = "dashboard.html";
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
}

// function signin() {
//   const loggingInUser = {
//     userEmail: loginUser.value,
//     password: loginpassword.value,
//   };

//   // console.log(loggingInUser)
//   var newUser = JSON.parse(localStorage.getItem("users"));
//   // console.log(newUser);

//   var signedInFlag = false;

//   for (i = 0; i < newUser.length; i++) {
//     // console.log(newUser[i])
//     if (
//       newUser[i].email == loggingInUser.userEmail &&
//       newUser[i].password == loggingInUser.password
//     ) {
//       var uid = i;
//       console.log("signed in");
//       signedInFlag = true;
//       location.href = "dashboard.html";

//       let currentUser = localStorage.setItem(
//         "currentUser",
//         JSON.stringify(newUser[i].userName)
//       );
//     }
//   }
//   if (!signedInFlag) {
//     console.log("something is wrong");
//   }
// }

function logout() {
  localStorage.removeItem("currentUser");
  location.href = "signin.html";
}

const createTeam = () => {
  var memberName = document.getElementById("teamName");
  var memberCategory = document.getElementById("category");
  var memberEmail = document.getElementById("email");

  if (memberCategory.value != "Category") {
    var key = firebase.database().ref("user").push().key;

    //.......................{Now We Will Put Data in Local Storage}..........................
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;

        const myTeamMember = {
          memberName: memberName.value,
          memberCategory: memberCategory.value,
          memberEmail: memberEmail.value,
          memberKey: key,
          leaderUid: uid,
        };

        console.log(user);
        firebase
          .database()
          .ref(`users/${uid}/myTeamMember/${key}`)
          .set(myTeamMember);
        const createBtn = document.getElementById("createBtn");
        createBtn.setAttribute("data-dismiss", "modal");

        if (category.value == "Developers") {
          let developerMembers = (document.getElementById(
            "developerMembers"
          ).innerText += `${myTeamMember.memberName}, `);
        } else if (category.value == "Animators") {
          let animatorMembers = (document.getElementById(
            "animatorMembers"
          ).innerText += `${myTeamMember.memberName}, `);
        }
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  } else {
    alert("Please put correct category");
  }
};

//.......................{ON_LODE FUNCTION}..................

const getMembers = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var uid = user.uid;
      // console.log(uid)
      firebase
        .database()
        .ref(`users/${uid}`)
        .once("value", (data) => {
          var userData = data.val();
          let currentUserName = document.getElementById("currentUserName");
          // console.log(currentUserName)
          // console.log(userData.userName);
          currentUserName.innerText = userData.userName;

          firebase
            .database()
            .ref(`users/${uid}/myTeamMember`)
            .once("value", (teamData) => {
              const teamMembersData = teamData.val();
              const allValues = Object.values(teamData.val());
              // console.log(allValues)
              allValues.map((userName) => {
                // console.log(userName.memberName)
                if (userName.memberCategory == "Animators") {
                  let animatorMembers =
                    document.getElementById("animatorMembers");
                  animatorMembers.innerText += ` ${userName.memberName},`;
                } else {
                  let developerMembers =
                    document.getElementById("developerMembers");
                  developerMembers.innerText += ` ${userName.memberName},`;
                }
              });
            });

          firebase
            .database()
            .ref(`users`)
            .once("value", (mylead) => {
              // console.log(mylead.val());
              // mylead.val()
              for (const property in mylead.val()) {
                console.log(property);
                // console.log(mylead.val()[property]);
                var differentUsers = mylead.val()[property];
                if (differentUsers.hasOwnProperty("myTeamMember")) {
                  // console.log(mylead.val()[property].myTeamMember);
                  console.log(differentUsers);
                  var unique = Object.values(differentUsers.myTeamMember);
                  console.log(unique);
                  unique.map((teamMember, index) => {
                    console.log(teamMember.memberName);
                    console.log(userData.userName);
                    if (teamMember.memberEmail == userData.email) {
                      console.log(teamMember.leaderUid);
                      firebase
                        .database()
                        .ref(`users/${teamMember.leaderUid}`)
                        .once("value", (teamLeader) => {
                          console.log(teamLeader.val().userName);
                          const teamLeaders =
                            document.getElementById("teamLeaders");
                          teamLeaders.innerText += ` ${
                            teamLeader.val().userName
                          },`;
                        });
                    }
                  });
                }
              }
            });
        });
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  // var getMemberss = JSON.parse(localStorage.getItem("myTeamMembers"));

  // for (i = 0; i < getMemberss.length; i++) {
  //   if (getMemberss[i].memberCategory == "Developers") {
  //     let developerMembers = (document.getElementById(
  //       "developerMembers"
  //     ).innerText += `${getMemberss[i].memberName}, `);
  //     teamName = document.getElementById("teamName");
  //     // console.log(teamName);
  //     teamName.value = " ";
  //     const createBtn = document.getElementById("createBtn");
  //     createBtn.setAttribute("data-dismiss", "modal");
  //   } else if (getMemberss[i].memberCategory == "Animators") {
  //     let animatorMembers = (document.getElementById(
  //       "animatorMembers"
  //     ).innerText += `${getMemberss[i].memberName}, `);
  //     teamName = document.getElementById("teamName");
  //     // console.log(teamName);
  //     teamName.value = " ";
  //   }
  // }
};

const getDate = () => {
  var date = new Date();
  let today = date.getDate();
  today = today.toString();
  console.log(today);
  today = today.length == 1 ? `0${today}` : today;
  let todayMonth = date.getMonth() + 1;
  todayMonth = todayMonth.toString();
  todayMonth = todayMonth.length == 1 ? `0${todayMonth}` : todayMonth;
  console.log(todayMonth);
  console.log(today);
  const todayYear = date.getFullYear();

  currentDate.value = `${todayYear}-${todayMonth}-${today}`;
  console.log(currentDate.value);
};
