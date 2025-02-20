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

function createPostUser(user) {
    let postUser = `<img src=${user.image}><a class="clickable-user" onclick="profileMenu(event)">${user.username} ${user.id}
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
        postArticle.innerHTML = `
        <div class="post-user">
        ${createPostUser(user)}
        </div>
        <h2>${posts[i].title}</h2>
        <p>${posts[i].body}</p>
        <p>${createTags(posts[i].tags)}</p>
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

            comments += `<li><a class="clickable-user" onclick="profileMenu(event)">${user.username}
            <div class="user-profile">
                Name:${user.firstName} ${user.lastName}
                Email:${user.email}
                Gender:${user.gender}
            </div>
            </a>: ${result.comments[i].body} <img src="thumpUp.gif">${result.comments[i].likes}</li>`;
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
