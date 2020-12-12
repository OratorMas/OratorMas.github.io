const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignUp = document.querySelector('.login-signUp');

const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user-name');
const exitElem = document.querySelector('.exit');
const editElem = document.querySelector('.edit');
const editElemContainer = document.querySelector('.edit-container');
const editButton = document.querySelector('.edit-button');

const editUsername = document.querySelector('.edit-username');
const editPostsCount = document.querySelector('.edit-postsCount');
const userAvatarElem = document.querySelector('.user-avatar');

const setUsers = {
  user: null,
  initUser(){
    console.log(1)
    auth.onAuthStateChanged(user => {
      if(user){
        this.user = user;
      } else {
        this.user = null;
      }
      toggleAuthDom()
    })
  },
  logIn(email, password) {
    console.log(2)
    auth.signInWithEmailAndPassword(email, password)
        .catch((err) => {
          alert(err.message)
        })
  },
  logOut() {
    auth.signOut();
    clearFields();
    toggleAuthDom();
  },
  signUp(email, password) {
    console.log(3)
    auth
        .createUserWithEmailAndPassword(email, password)
        .then((data) => {
          this.editUser(email.substring(0, email.indexOf('@')), 5)
          database.ref('users/'+auth.currentUser.uid).update({
            postsOnPage: 5
          })})
        .catch((err) => {
          alert(err.message)
        });
  },
  editUser(displayName, postsCount){
    console.log(4)
    const user = auth.currentUser;
    
    if(displayName){
        user.updateProfile({
          displayName,
        }).then(()=>{
          if (postsCount){
            database.ref('users/'+user.uid).update({
              postsOnPage: postsCount
            }).then(()=>toggleAuthDom())
          }
        })
    }
  },
};

const emailValidator = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const clearFields = () => {
  loginForm.reset();
}

const loginFormInit = () => {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    setUsers.logIn(emailInput.value, passwordInput.value);
  });

  loginSignUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = emailInput.value;
    if(emailValidator(email)){
      setUsers.signUp(email, passwordInput.value);
    } else {
      alert('Email wrong format');
      clearFields();
    }
  });

  exitElem.addEventListener('click', (event) =>{
    event.preventDefault();
    setUsers.logOut();
  });

  editElem.addEventListener('click', event =>{
    event.preventDefault();
    editElemContainer.classList.toggle('visible');
    editUsername.value = setUsers.user.displayName;
  });
  editElemContainer.addEventListener('submit', event =>{

    event.preventDefault();
    setUsers.editUser(editUsername.value, editPostsCount.value > 0 ? editPostsCount.value : 5);
    editElemContainer.classList.remove('visible');
  });
  
  setUsers.initUser();
}

document.addEventListener('DOMContentLoaded', ()=> {
  loginFormInit();
})




