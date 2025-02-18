fetchPosts();

async function fetchPosts() {
    let result = await fetch('https://dummyjson.com/posts')
    result = await result.json();
    createPosts(result.posts);
}

async function createPostUser(user) {
    let postUser = `<img src=${user.image}><a class="clickable-user" onclick="profileMenu(event)">${user.username}
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
        let user = await getUser(posts[i].id);
        /* or do you mean like this?
        let post = {
            id: posts[i].id,
            title: posts[i].title,
            body: posts[i].body,
            reactions: {
                likes: posts[i].reactions.likes,
                dislikes: posts[i].reactions.dislikes
            }
        }
        */
       let postArticle = document.createElement('article');
        postArticle.innerHTML = `
        <div class="post-user">
        ${await createPostUser(user)}
        </div>
        <h2>${posts[i].title}</h2>
        <p>${posts[i].body}</p>
        <p>${await getTags(posts[i].id)}</p>
        <p><img src="thumpUp.gif">${posts[i].reactions.likes} <img src="thumpDown.gif">${posts[i].reactions.dislikes}</p>
        <div>
        <h3>Comments</h3>
        <ul>
        ${await getComments(posts[i].id)}
        </ul>
        </div>
        `;

        section.appendChild(postArticle);
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
}

async function getTags(postId) {
    let result = await fetch(`https://dummyjson.com/posts/${postId}`)
    result = await result.json();
    let tags = "";
    for (let i = 0; i < result.tags.length; i++) {
        tags += `#${result.tags[i]} `;
    }
    return tags;
}

async function getComments(postId) {
    let result = await fetch(`https://dummyjson.com/posts/${postId}/comments`)
    result = await result.json();

    let comments = "";
    for (let i = 0; i < result.comments.length; i++) {
        /* or do you mean like this?
        user.username = result.comments[i].user.username;
        user.body = result.comments[i].body;
        user.likes = result.comments[i].likes;
        */
       let user = await getUser(result.comments[i].user.id);

        comments += `<li><a class="clickable-user" onclick="profileMenu(event)">${user.username}
        <div class="user-profile">
            Name:${user.firstName} ${user.lastName}
            Email:${user.email}
            Gender:${user.gender}
        </div>
        </a>: ${result.comments[i].body} <img src="thumpUp.gif">${result.comments[i].likes}</li>`;
    }
    if (comments === "") {
        comments = "No comments available.";
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
