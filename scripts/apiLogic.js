/*
The infinite scroll is mostly from:
https://www.geeksforgeeks.org/how-to-create-infinite-scrolling-using-onscroll-event-in-javascript/
*/

let pageNum = 1;
let isLoading = false;
let postsArray = [];
let usersArray = [];
let commentsArray = [];
const itemsPerPage = 5;

const container = document.querySelector("main");
const resultContainer = document.querySelector("section");

function start(posts, users, comments) {
    if (isLoading) return;
    isLoading = true;

    postsArray = posts;
    usersArray = users;
    commentsArray = comments;
    displayItems(pageNum, users, comments);

    isLoading = false;
}

function displayItems(page, users, comments) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = postsArray.slice(startIndex, endIndex);

    itemsToDisplay.forEach((post) => {
        createPosts(post, users, comments);
    });

    isLoading = false;
}

container.onscroll = () => {
    if (isLoading) return;

    if (
        Math.ceil(container.clientHeight + container.scrollTop) >=
        container.scrollHeight
    ) {
        isLoading = true;
        pageNum++;
        displayItems(pageNum, usersArray, commentsArray);
    }
};






fetchData();

async function fetchData() {
    try {
        const data = await Promise.all([ 
            fetch('https://dummyjson.com/posts?limit=0'),
            fetch(`https://dummyjson.com/users?limit=0`),
            fetch(`https://dummyjson.com/comments?limit=0`)
        ])
    
        data.forEach(response => {
            if(!response.ok) {
                throw new Error('An error occured while fetching data. ', response.status);
            }
        });
        
        const [postsResponse, usersResponse, commentsResponse] = data;
        const posts = await postsResponse.json();
        const users = await usersResponse.json();
        const comments = await commentsResponse.json();

        let usersObject = createUsersObject(users.users);
        let postsObject = createPostObject(posts.posts);
        let commentsObject = createCommentsObject(comments.comments);

        start(postsObject, usersObject, commentsObject);
        
    } catch (error) {
        console.log(error, 'An error occured while fetching posts.');
    }
}

function createPostObject(posts) {
    let postsObject = []
    
    posts.forEach(element => {
        let post = {
            id: element.id,
            userId: element.userId,
            title: element.title,
            body: element.body,
            tags: element.tags,
            reactions: element.reactions
        }
        
        postsObject.push(post);
    });
    return postsObject;
}

function createCommentsObject(comments) {
    let commentsObject = []

    comments.forEach(element => {
        let comment = {
            id: element.id,
            postId: element.postId,
            user: element.user,
            body: element.body
        }
        commentsObject.push(comment);
    });
    return commentsObject;
}

function createUsersObject(users) {
    let usersObject = []
    
    users.forEach(element => {
        let user = {
            id: element.id,
            username: element.username,
            firstName: element.firstName,
            lastName: element.lastName,
            email: element.email,
            gender: element.gender,
            country: element.address.country,
            image: element.image,
            }
        
        usersObject.push(user);
    });
    return usersObject;
}

function createPostUser(user) {

    let img = document.createElement('img');
    img.src = user.image;
    img.alt = "User-profile picture.";

    let username = document.createElement('a');
    username.classList.add('clickable-user');
    username.textContent = user.username;
    username.onclick = profileMenu;

    let userProfile = document.createElement('div');
    userProfile.classList.add('user-profile');
    userProfile.innerHTML = `Name:${user.firstName} ${user.lastName}
    Email:${user.email}
    Gender:${user.gender}`;

    username.appendChild(img);

    username.appendChild(userProfile);

    return username;
}

function createPosts(posts, users, commentsJSON) {
    let section = document.querySelector('section');    
    
        let user = getUser(posts.userId, users);
        let postArticle = document.createElement('article');
        
        let postUser = document.createElement('div');
        postUser.classList.add('post-user');
        postUser.appendChild(createPostUser(user));

        let postContent = document.createElement('div');
        postContent.classList.add('post-content');

        let title = document.createElement('h2');
        title.textContent = posts.title;

        let postText = document.createElement('p');
        postText.textContent = posts.body;

        let tags = document.createElement('p');
        tags.textContent = createTags(posts.tags);

        let reactions = document.createElement('p');
        let likesImg = document.createElement('img');
        likesImg.src = "thumpUp.gif";
        likesImg.alt = "A picture of a thumps up to show likes.";
        reactions.appendChild(likesImg);
        reactions.innerHTML += posts.reactions.likes;

        let dislikesImg = document.createElement('img');
        dislikesImg.src = "thumpDown.gif";
        dislikesImg.alt = "A picture of a thumps down to show dislikes.";
        reactions.appendChild(dislikesImg);
        reactions.innerHTML += posts.reactions.dislikes;

        postContent.appendChild(title);
        postContent.appendChild(postText);
        postContent.appendChild(tags);
        postContent.appendChild(reactions);

        let comment = document.createElement('div');

        let commentTitle = document.createElement('h3');
        commentTitle.textContent = "Comments";
        let commentList = document.createElement('ul');
        let comments = createComments(posts.id, commentsJSON, users);
        commentList.appendChild(comments);
        comment.appendChild(commentTitle);
        comment.appendChild(commentList);

        postArticle.appendChild(postUser);
        postArticle.appendChild(postContent);
        postArticle.appendChild(comment);

        let fragment = document.createDocumentFragment();
        fragment.appendChild(postArticle);
        section.appendChild(fragment);
    
}

function getUser(postId, users) {
    let user = users.find(user => user.id === postId);
    return user;
}

function createTags(tagsArray) {
    let tags = "";
    for (let i = 0; i < tagsArray.length; i++) {
        tags += `#${tagsArray[i]} `;
    }
    return tags;
}

function createComments(postId, comments, users) {
        let fragment = document.createDocumentFragment();

        let commentsArray = comments.filter(comment => comment.postId === postId);
        commentsArray.forEach(element => {
            let liElement = document.createElement('li');
            

            let user = getUser(element.user.id, users);
            let userComment = createPostUser(user);
            liElement.appendChild(userComment);

            let comment = document.createElement('p');
            comment.classList.add('comment-text');
            comment.textContent =": " + element.body;
            liElement.appendChild(comment);

            fragment.appendChild(liElement);
        });
        if(commentsArray.length === 0) {
            let liElement = document.createElement('li');
            let comment = document.createElement('p');
            comment.textContent = "No comments available.";
            liElement.appendChild(comment);
            fragment.appendChild(liElement);
        }
        return fragment;
    }

function profileMenu(event) {
    let profile = event.target.closest('.clickable-user').querySelector('.user-profile');
    
    if (profile.style.display === 'block') {
        profile.style.display = 'none';
    } else {
        profile.style.display = 'block';
    }
}
