fetchPosts();

async function fetchPosts() {
    try {
        let result = await fetch('https://dummyjson.com/posts?limit=0')
        result = await result.json();
        createPosts(result.posts);
    } catch (error) {
        console.log(error, 'An error occured while fetching posts.');
    }
}
asdasdasdas
function createPostUser(user) {
    let postUser = `<img src=${user.image} alt="User-profile picture."><a class="clickable-user" onclick="profileMenu(event)">${user.username}
        <div class="user-profile">
            Name:${user.firstName} ${user.lastName}
            Email:${user.email}
            Gender:${user.gender}
        </div>
        </a>`

    return postUser;
}

async function createPosts(posts) {
    let section = document.querySelector('section');
    
    for (let i = 0; i < posts.length; i++) {
        let user = await getUser(posts[i].userId);
        let postArticle = document.createElement('article');
        
        let postUser = document.createElement('div');
        postUser.classList.add('post-user');
        postUser.innerHTML = createPostUser(user);

        let postContent = document.createElement('div');
        postContent.classList.add('post-content');
        let title = document.createElement('h2');
        title.textContent = posts[i].title;
        let postText = document.createElement('p');
        postText.textContent = posts[i].body;
        let tags = document.createElement('p');
        tags.textContent = createTags(posts[i].tags);
        let reactions = document.createElement('p');
        reactions.innerHTML = `<img src="thumpUp.gif" alt="A picture of a thumps up to show likes.">${posts[i].reactions.likes} <img src="thumpDown.gif" alt="A picture of a thumps down to show dislikes.">${posts[i].reactions.dislikes}`;
        postContent.appendChild(title);
        postContent.appendChild(postText);
        postContent.appendChild(tags);
        postContent.appendChild(reactions);

        let comment = document.createElement('div');
        let commentTitle = document.createElement('h3');
        commentTitle.textContent = "Comments";
        let commentList = document.createElement('ul');
        let comments = await getComments(posts[i].id);
        commentList.innerHTML = comments;
        comment.appendChild(commentTitle);
        comment.appendChild(commentList);

        postArticle.appendChild(postUser);
        postArticle.appendChild(postContent);
        postArticle.appendChild(comment);

        let fragment = document.createDocumentFragment();
        fragment.appendChild(postArticle);
        section.appendChild(fragment);
    }        
}

async function getUser(postId) {
    let user = {
        id: "",
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
        username: "",
        image: ""
    }
    try {
        let result = await fetch(`https://dummyjson.com/user/${postId}`)
        result = await result.json();
        user.id = result.id;
        user.firstName = result.firstName;
        user.lastName = result.lastName;
        user.age = result.age;
        user.gender = result.gender;
        user.email = result.email;
        user.phone = result.phone;
        user.username = result.username;
        user.image = result.image;

        return user;

    } catch (error) {
        console.log(error, `An error occured while fetching user data with id ${postId}.`);
    }
}

function createTags(tagsArray) {
    let tags = "";
    for (let i = 0; i < tagsArray.length; i++) {
        tags += `#${tagsArray[i]} `;
    }
    return tags;
}

async function getComments(postId) {
    try {
        let result = await fetch(`https://dummyjson.com/posts/${postId}/comments`)
        result = await result.json();
        let comments = createComments(result)
        return comments;
    } catch (error) {
        console.log(error, `An error occured while fetching comments for post with id ${postId}.`);
    }
}

    async function createComments(result) {
        let comments = "";
        for (let i = 0; i < result.comments.length; i++) {
            
        let user = await getUser(result.comments[i].user.id);
            //maybe have one same function for create user and the comments as i did above or the extra info as
            //a function that i call for comments and post-user

            //nog samma här med createelement osv
            comments += `<li><a class="clickable-user" onclick="profileMenu(event)">${user.username}
            <div class="user-profile">
                Name:${user.firstName} ${user.lastName}
                Email:${user.email}
                Gender:${user.gender}
            </div>
            </a>: ${result.comments[i].body} <img src="thumpUp.gif" alt="A picture of a thumps up to show likes.">${result.comments[i].likes}</li>`;
        }
        if (comments === "") {
            comments = "<li>No comments available.</li>";
        }
        return comments;
    }

function profileMenu(event) {
    let profile = event.target.closest('.clickable-user').querySelector('.user-profile');
    
    if (profile.style.display === 'block') {
        profile.style.display = 'none';
    } else {
        profile.style.display = 'block';
    }
}
