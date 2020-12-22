<<<<<<< Updated upstream
const login = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const getEmail = document.querySelector('.login-email');
const getPass = document.querySelector('.login-password');
const signUp = document.querySelector('.login-signUp');

const userElem = document.querySelector('.user');
const userName = document.querySelector('.user-name');
const exit = document.querySelector('.exit');
const edit = document.querySelector('.edit');
const editContainer = document.querySelector('.edit-container');
const editButton = document.querySelector('.edit-button');

const editUserNameField = document.querySelector('.edit-username');
const editShowedPostsOnPageField = document.querySelector('.edit-postsCount');
const userPhoto = document.querySelector('.user-photo');


const postHolder = document.querySelector('.posts');
const newPost = document.querySelector('.button-new-post');
const addPostForm = document.querySelector('.add-post');
const editPostForm = document.querySelector('.edit-post');
const nextPage = document.querySelector('.next-page-button');
const prevPage = document.querySelector('.prev-page-button');

const adminEmail = 'rogulin@list.ru'

let editablePostID;
let postsOnPage = 0;
let allPostsCount = 1000;

const firebaseConfig = {
  apiKey: "AIzaSyBDcg9QHlqhYUfvO5aHRtXSYKedM3LRo6s",
  authDomain: "rogulinweb.firebaseapp.com",
  databaseURL: "https://rogulinweb-default-rtdb.firebaseio.com",
  projectId: "rogulinweb",
  storageBucket: "rogulinweb.appspot.com",
  messagingSenderId: "37311629682",
  appId: "1:37311629682:web:8cdc952894017e959275eb"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

let menuToggle = document.querySelector('#menu-toggle');
let menu = document.querySelector('.sidebar');
menuToggle.addEventListener('click', function (event) {
  event.preventDefault();
  menu.classList.toggle('visible');
})

const defPhoto = userPhoto.src;

const updatePage = () => {
  
  const user = setUsers.user;
  if(user) {
    login.style.display = 'none';
    userElem.style.display = '';
    userName.textContent = user.displayName;
    userPhoto.src = user.photoURL || defPhoto;
    database.ref('users/'+user.uid).once('value', snap => {
      editShowedPostsOnPageField.value = snap.val().postsOnPage;
    })
    newPost.classList.add('visible');
    printPosts(user.uid);
  } else {
    login.style.display = '';
    userElem.style.display = 'none';
    
    
    newPost.classList.remove('visible');
    addPostForm.classList.remove('visible');
    postHolder.classList.add('visible');
    printPosts();
  }
  
}

const setUsers = {
  user: null,
  initUser(){
    auth.onAuthStateChanged(user => {
      if(user){
        this.user = user;
      } else {
        this.user = null;
      }
      updatePage()
    })
  },
  logIn(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .catch((err) => {
          alert(err.message)
        })
  },
  logOut() {
    auth.signOut();
    clear();
    updatePage();
  },
  signUp(email, password) {
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
    const user = auth.currentUser;
    
    if(displayName){
        user.updateProfile({
          displayName,
        }).then(()=>{
          if (postsCount){
            database.ref('users/'+user.uid).update({
              postsOnPage: postsCount
            }).then(()=>updatePage())
          }
        })
    }
  },
};

const emailRegex = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const clear = () => {
  loginForm.reset();
}

const loginInitialize = () => {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    setUsers.logIn(getEmail.value, getPass.value);
  });

  signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = getEmail.value;
    if(emailRegex(email)){
      setUsers.signUp(email, getPass.value);
    } else {
      alert('Email wrong format');
      clear();
    }
  });

  exit.addEventListener('click', (event) =>{
    event.preventDefault();
    setUsers.logOut();
  });

  edit.addEventListener('click', event =>{
    event.preventDefault();
    editContainer.classList.toggle('visible');
    editUserNameField.value = setUsers.user.displayName;
  });
  editContainer.addEventListener('submit', event =>{

    event.preventDefault();
    setUsers.editUser(editUserNameField.value, editShowedPostsOnPageField.value > 0 ? editShowedPostsOnPageField.value : 5);
    editContainer.classList.remove('visible');
  });
  
  setUsers.initUser();
}

const printPosts = (userID, isPrev) => {
  let postsHTML = '';
  let posts = [];
  let counter = 0;
  database.ref('post').orderByChild('id').once('value', snapshot => {
    (snapshot || []).forEach(item=>{
      posts.push(`
              <section class="post">
                <div class="post-body">
                  <h2 class="post-title">${item.val().title}</h2>
                  <p class="post-text" >${item.val().text}</p>
                  <div class="tags">
                    ${(item.val().tags || []).map(tag=>`<a href="#" class="tag">${tag}</a>`)}
                  </div>
                </div>
                <div class="post-footer">
                  <div class="post-buttons">
                    ${setUsers.user? item.val().author.email === (setUsers.user.email || null) || setUsers.user.email === adminEmail?
          `<button class="post-button post-button-delete" value="${item.val().id}" onclick="deletePost(value)">
                  <svg width="17" height="19" class="icon icon-delete">
                    <use xlink:href="img/icons.svg#delete"></use>
                  </svg>
                </button>`: `` :``}
                    ${setUsers.user? item.val().author.email === (setUsers.user.email || null) || setUsers.user.email === adminEmail?
          `<button class="post-button post-button-edit" value="${item.val().id}" onclick="editPost(value)">
                  <svg width="17" height="19" class="icon icon-edit">
                    <use xlink:href="img/icons.svg#edit"></use>
                  </svg>
                </button>`: `` :``}
                  </div>
                  <div class="post-author">
                    <div class="author-about">
                      <a href="#" class="author-username">${item.val().author.displayName}</a>
                      <span class="post-time">${item.val().date}</span>
                    </div>
                  <a href="#" class="author-link"><img src=${item.val().author.photo || "img/dog.png"} alt="avatar" class="author-avatar"></a>
                </div>
                </div>
              </section>`);
    })}).then(()=> {
    if(userID) {
      database.ref('users/'+userID).once('value', snapshot => {
        allPostsCount = snapshot.val().postsOnPage;
        if(parseInt(isPrev) === 0 || parseInt(isPrev) === 1){
          if(parseInt(isPrev) === 0 && postsOnPage < posts.length-parseInt(allPostsCount)) {
            postsOnPage = parseInt(postsOnPage)+parseInt(allPostsCount);
            //nextPage
          } else if (parseInt(isPrev) === 1 && postsOnPage !== 0) {
            postsOnPage=parseInt(postsOnPage)-parseInt(allPostsCount);
            //prevPage
          } else {
            return;
          }
        }
        counter = 0;
        posts.reverse().forEach(post => {
          if(counter >= postsOnPage && counter < parseInt(postsOnPage)+parseInt(allPostsCount)){
            postsHTML+=post;
          }
          
          counter++;
        })
        postHolder.innerHTML = postsHTML;
        postsHTML = '';
        addPostForm.classList.remove('visible');
        editPostForm.classList.remove('visible');
        postHolder.classList.add('visible');
      })
    } else {
      posts.reverse().forEach(post => {
        postsHTML+=post;
      })
      postHolder.innerHTML = postsHTML;
      postsHTML = '';
      addPostForm.classList.remove('visible');
      editPostForm.classList.remove('visible');
      postHolder.classList.add('visible');
    }
    
  })
}

const setAddPostForm = () => {
  addPostForm.classList.add('visible');
  postHolder.classList.remove('visible');
  editPostForm.classList.remove('visible');
  editPostForm.reset();
}

const setEditPostForm = (title, text, tags, postID) => {
  editPostForm.classList.add('visible');
  editPostForm.elements.namedItem('edit-post-title').value = title;
  editPostForm.elements.namedItem('edit-post-text').value = text;
  editPostForm.elements.namedItem('edit-post-tags').value = tags;
  editablePostID = postID;
  postHolder.classList.remove('visible');
}

const postHandlerInit = () => {
  printPosts();
  nextPage.addEventListener('click', event => {
    event.preventDefault();
    printPosts(auth.currentUser.uid, 0)
  })
  prevPage.addEventListener('click', event => {
    event.preventDefault();
    printPosts(auth.currentUser.uid, 1)
  })
  newPost.addEventListener('click', event => {
    event.preventDefault();
    setAddPostForm();
  })
  
  addPostForm.addEventListener('submit', event => {
    event.preventDefault();
    const formElements = addPostForm.elements;
    //TODO вернуть нормальные значениея
    if(formElements.namedItem('post-title').value.length < 0){
      alert('Слишком короткий заголовок');
      return;
    }
    if(formElements.namedItem('post-text').value.length < 0){
      alert('Слишком короткий пост');
      return;
    }
    const postID = 'postID'+(+new Date()).toString(16)
    database.ref('post/'+postID).set({
      id: postID,
      title: formElements.namedItem('post-title').value,
      text: formElements.namedItem('post-text').value,
      tags: formElements.namedItem('post-tags').value.split(',').map(item=>item.trim()),
      author: {
        displayName: setUsers.user.displayName,
        photo: setUsers.user.photoURL,
        email: setUsers.user.email
      },
      date: new Date().toLocaleString()
    })
    printPosts(auth.currentUser.uid);
    
    addPostForm.reset();
  })
  
  editPostForm.addEventListener('submit', event => {
    event.preventDefault();
    const formElements = editPostForm.elements;
    //TODO вернуть нормальные значениея
    if(formElements.namedItem('edit-post-title').value.length < 0){
      alert('Слишком короткий заголовок');
      return;
    }
    if(formElements.namedItem('edit-post-text').value.length < 0){
      alert('Слишком короткий пост');
      return;
    }
    
    database.ref('post/'+editablePostID).update({
      id: editablePostID,
      title: formElements.namedItem('edit-post-title').value,
      text: formElements.namedItem('edit-post-text').value,
      tags: formElements.namedItem('edit-post-tags').value.split(',').map(item=>item.trim()),
      author: {
        displayName: setUsers.user.displayName,
        photo: setUsers.user.photoURL,
        email: setUsers.user.email
      },
      date: new Date().toLocaleString()
    })
    printPosts(auth.currentUser.uid);
    
    editPostForm.reset();
  })
}

const deletePost = (postID) => {
  database.ref('post')
      .once('value', snap => {
        snap.forEach(item => {
          if(item.val().id === postID){
            database.ref('post').child(item.key).remove()
                .then(()=>{
                  printPosts(auth.currentUser.uid)
                  return true;
                })
          }
        })
      })
  
}

const editPost = (postID) => {
  database.ref('post')
      .once('value', snap => {
        snap.forEach(item => {
          if(item.val().id === postID){
            setEditPostForm(item.val().title, item.val().text, item.val().tags, postID)
          }
        })
      })
}

document.addEventListener('DOMContentLoaded', ()=> {
  loginInitialize();
  postHandlerInit();
=======
const login = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const getEmail = document.querySelector('.login-email');
const getPass = document.querySelector('.login-password');
const signUp = document.querySelector('.login-signUp');

const userElem = document.querySelector('.user');
const userName = document.querySelector('.user-name');
const exit = document.querySelector('.exit');
const edit = document.querySelector('.edit');
const editContainer = document.querySelector('.edit-container');
const editButton = document.querySelector('.edit-button');

const editUserNameField = document.querySelector('.edit-username');
const editShowedPostsOnPageField = document.querySelector('.edit-postsCount');
const userPhoto = document.querySelector('.user-photo');


const postHolder = document.querySelector('.posts');
const newPost = document.querySelector('.button-new-post');
const addPostForm = document.querySelector('.add-post');
const editPostForm = document.querySelector('.edit-post');
const nextPage = document.querySelector('.next-page-button');
const prevPage = document.querySelector('.prev-page-button');

const adminEmail = 'rogulin@list.ru'

let editablePostID;
let postsOnPage = 0;
let allPostsCount = 1000;

const firebaseConfig = {
  apiKey: "AIzaSyBDcg9QHlqhYUfvO5aHRtXSYKedM3LRo6s",
  authDomain: "rogulinweb.firebaseapp.com",
  databaseURL: "https://rogulinweb-default-rtdb.firebaseio.com",
  projectId: "rogulinweb",
  storageBucket: "rogulinweb.appspot.com",
  messagingSenderId: "37311629682",
  appId: "1:37311629682:web:8cdc952894017e959275eb"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

let menuToggle = document.querySelector('#menu-toggle');
let menu = document.querySelector('.sidebar');
menuToggle.addEventListener('click', function (event) {
  event.preventDefault();
  menu.classList.toggle('visible');
})

const defPhoto = userPhoto.src;

const updatePage = () => {
  
  const user = setUsers.user;
  if(user) {
    login.style.display = 'none';
    userElem.style.display = '';
    userName.textContent = user.displayName;
    userPhoto.src = user.photoURL || defPhoto;
    database.ref('users/'+user.uid).once('value', snap => {
      editShowedPostsOnPageField.value = snap.val().postsOnPage;
    })
    newPost.classList.add('visible');
    printPosts(user.uid);
  } else {
    login.style.display = '';
    userElem.style.display = 'none';
    
    
    newPost.classList.remove('visible');
    addPostForm.classList.remove('visible');
    postHolder.classList.add('visible');
    printPosts();
  }
  
}

const setUsers = {
  user: null,
  initUser(){
    auth.onAuthStateChanged(user => {
      if(user){
        this.user = user;
      } else {
        this.user = null;
      }
      updatePage()
    })
  },
  logIn(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .catch((err) => {
          alert(err.message)
        })
  },
  logOut() {
    auth.signOut();
    clear();
    updatePage();
  },
  signUp(email, password) {
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
    const user = auth.currentUser;
    
    if(displayName){
        user.updateProfile({
          displayName,
        }).then(()=>{
          if (postsCount){
            database.ref('users/'+user.uid).update({
              postsOnPage: postsCount
            }).then(()=>updatePage())
          }
        })
    }
  },
};

const emailRegex = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const clear = () => {
  loginForm.reset();
}

const loginInitialize = () => {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    setUsers.logIn(getEmail.value, getPass.value);
  });

  signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = getEmail.value;
    if(emailRegex(email)){
      setUsers.signUp(email, getPass.value);
    } else {
      alert('Email wrong format');
      clear();
    }
  });

  exit.addEventListener('click', (event) =>{
    event.preventDefault();
    setUsers.logOut();
  });

  edit.addEventListener('click', event =>{
    event.preventDefault();
    editContainer.classList.toggle('visible');
    editUserNameField.value = setUsers.user.displayName;
  });
  editContainer.addEventListener('submit', event =>{

    event.preventDefault();
    setUsers.editUser(editUserNameField.value, editShowedPostsOnPageField.value > 0 ? editShowedPostsOnPageField.value : 5);
    editContainer.classList.remove('visible');
  });
  
  setUsers.initUser();
}

const printPosts = (userID, isPrev) => {
  let postsHTML = '';
  let posts = [];
  let counter = 0;
  database.ref('post').orderByChild('id').once('value', snapshot => {
    (snapshot || []).forEach(item=>{
      posts.push(`
              <section class="post">
                <div class="post-body">
                  <h2 class="post-title">${item.val().title}</h2>
                  <p class="post-text" >${item.val().text}</p>
                  <div class="tags">
                    ${(item.val().tags || []).map(tag=>`<a href="#" class="tag">${tag}</a>`)}
                  </div>
                </div>
                <div class="post-footer">
                  <div class="post-buttons">
                    ${setUsers.user? item.val().author.email === (setUsers.user.email || null) || setUsers.user.email === adminEmail?
          `<button class="post-button post-button-delete" value="${item.val().id}" onclick="deletePost(value)">
                  <svg width="17" height="19" class="icon icon-delete">
                    <use xlink:href="img/icons.svg#delete"></use>
                  </svg>
                </button>`: `` :``}
                    ${setUsers.user? item.val().author.email === (setUsers.user.email || null) || setUsers.user.email === adminEmail?
          `<button class="post-button post-button-edit" value="${item.val().id}" onclick="editPost(value)">
                  <svg width="17" height="19" class="icon icon-edit">
                    <use xlink:href="img/icons.svg#edit"></use>
                  </svg>
                </button>`: `` :``}
                  </div>
                  <div class="post-author">
                    <div class="author-about">
                      <a href="#" class="author-username">${item.val().author.displayName}</a>
                      <span class="post-time">${item.val().date}</span>
                    </div>
                  <a href="#" class="author-link"><img src=${item.val().author.photo || "img/dog.png"} alt="avatar" class="author-avatar"></a>
                </div>
                </div>
              </section>`);
    })}).then(()=> {
    if(userID) {
      database.ref('users/'+userID).once('value', snapshot => {
        allPostsCount = snapshot.val().postsOnPage;
        if(parseInt(isPrev) === 0 || parseInt(isPrev) === 1){
          if(parseInt(isPrev) === 0 && postsOnPage < posts.length-parseInt(allPostsCount)) {
            postsOnPage = parseInt(postsOnPage)+parseInt(allPostsCount);
            //nextPage
          } else if (parseInt(isPrev) === 1 && postsOnPage !== 0) {
            postsOnPage=parseInt(postsOnPage)-parseInt(allPostsCount);
            //prevPage
          } else {
            return;
          }
        }
        counter = 0;
        posts.reverse().forEach(post => {
          if(counter >= postsOnPage && counter < parseInt(postsOnPage)+parseInt(allPostsCount)){
            postsHTML+=post;
          }
          
          counter++;
        })
        postHolder.innerHTML = postsHTML;
        postsHTML = '';
        addPostForm.classList.remove('visible');
        editPostForm.classList.remove('visible');
        postHolder.classList.add('visible');
      })
    } else {
      posts.reverse().forEach(post => {
        postsHTML+=post;
      })
      postHolder.innerHTML = postsHTML;
      postsHTML = '';
      addPostForm.classList.remove('visible');
      editPostForm.classList.remove('visible');
      postHolder.classList.add('visible');
    }
    
  })
}

const setAddPostForm = () => {
  addPostForm.classList.add('visible');
  postHolder.classList.remove('visible');
  editPostForm.classList.remove('visible');
  editPostForm.reset();
}

const setEditPostForm = (title, text, tags, postID) => {
  editPostForm.classList.add('visible');
  editPostForm.elements.namedItem('edit-post-title').value = title;
  editPostForm.elements.namedItem('edit-post-text').value = text;
  editPostForm.elements.namedItem('edit-post-tags').value = tags;
  editablePostID = postID;
  postHolder.classList.remove('visible');
}

const postHandlerInit = () => {
  printPosts();
  nextPage.addEventListener('click', event => {
    event.preventDefault();
    printPosts(auth.currentUser.uid, 0)
  })
  prevPage.addEventListener('click', event => {
    event.preventDefault();
    printPosts(auth.currentUser.uid, 1)
  })
  newPost.addEventListener('click', event => {
    event.preventDefault();
    setAddPostForm();
  })
  
  addPostForm.addEventListener('submit', event => {
    event.preventDefault();
    const formElements = addPostForm.elements;
    //TODO вернуть нормальные значениея
    if(formElements.namedItem('post-title').value.length < 0){
      alert('Слишком короткий заголовок');
      return;
    }
    if(formElements.namedItem('post-text').value.length < 0){
      alert('Слишком короткий пост');
      return;
    }
    const postID = 'postID'+(+new Date()).toString(16)
    database.ref('post/'+postID).set({
      id: postID,
      title: formElements.namedItem('post-title').value,
      text: formElements.namedItem('post-text').value,
      tags: formElements.namedItem('post-tags').value.split(',').map(item=>item.trim()),
      author: {
        displayName: setUsers.user.displayName,
        photo: setUsers.user.photoURL,
        email: setUsers.user.email
      },
      date: new Date().toLocaleString()
    })
    printPosts(auth.currentUser.uid);
    
    addPostForm.reset();
  })
  
  editPostForm.addEventListener('submit', event => {
    event.preventDefault();
    const formElements = editPostForm.elements;
    //TODO вернуть нормальные значениея
    if(formElements.namedItem('edit-post-title').value.length < 0){
      alert('Слишком короткий заголовок');
      return;
    }
    if(formElements.namedItem('edit-post-text').value.length < 0){
      alert('Слишком короткий пост');
      return;
    }
    
    database.ref('post/'+editablePostID).update({
      id: editablePostID,
      title: formElements.namedItem('edit-post-title').value,
      text: formElements.namedItem('edit-post-text').value,
      tags: formElements.namedItem('edit-post-tags').value.split(',').map(item=>item.trim()),
      author: {
        displayName: setUsers.user.displayName,
        photo: setUsers.user.photoURL,
        email: setUsers.user.email
      },
      date: new Date().toLocaleString()
    })
    printPosts(auth.currentUser.uid);
    
    editPostForm.reset();
  })
}

const deletePost = (postID) => {
  database.ref('post')
      .once('value', snap => {
        snap.forEach(item => {
          if(item.val().id === postID){
            database.ref('post').child(item.key).remove()
                .then(()=>{
                  printPosts(auth.currentUser.uid)
                  return true;
                })
          }
        })
      })
  
}

const editPost = (postID) => {
  database.ref('post')
      .once('value', snap => {
        snap.forEach(item => {
          if(item.val().id === postID){
            setEditPostForm(item.val().title, item.val().text, item.val().tags, postID)
          }
        })
      })
}

document.addEventListener('DOMContentLoaded', ()=> {
  loginInitialize();
  postHandlerInit();
>>>>>>> Stashed changes
})