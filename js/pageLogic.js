const firebaseConfig = {
    apiKey: "AIzaSyBDcg9QHlqhYUfvO5aHRtXSYKedM3LRo6s",
    authDomain: "rogulinweb.firebaseapp.com",
    databaseURL: "https://rogulinweb-default-rtdb.firebaseio.com",
    projectId: "rogulinweb",
    storageBucket: "rogulinweb.appspot.com",
    messagingSenderId: "37311629682",
    appId: "1:37311629682:web:8cdc952894017e959275eb"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// Создаем переменную, в которую положим кнопку меню
let menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
let menu = document.querySelector('.sidebar');
// отслеживаем клик по кнопке меню и запускаем функцию
menuToggle.addEventListener('click', function (event) {
    // отменяем стандартное поведение ссылки
    event.preventDefault();
    // вешаем класс на меню, когда кликнули по кнопке меню
    menu.classList.toggle('visible');
})

const  DEFAULT_PHOTO = userAvatarElem.src;
//1.41
const toggleAuthDom = () => {
    
    const user = setUsers.user;
    if(user) {
        loginElem.style.display = 'none';
        userElem.style.display = '';
        userNameElem.textContent = user.displayName;
        userAvatarElem.src = user.photoURL || DEFAULT_PHOTO;
        database.ref('users/'+user.uid).once('value', snap => {
            editPostsCount.value = snap.val().postsOnPage;
        })
        newPostButton.classList.add('visible');
        showAllPosts(user.uid);
    } else {
        loginElem.style.display = '';
        userElem.style.display = 'none';
        
        
        newPostButton.classList.remove('visible');
        addPostForm.classList.remove('visible');
        postsWrapper.classList.add('visible');
        showAllPosts();
    }
    
}