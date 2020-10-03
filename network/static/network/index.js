document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#following').addEventListener('click', () => load_followed_posts());
    load_posts();
    
});

function load_posts() {
    fetch(`/load`)
    .then(response => response.json())
    .then(posts => {
        document.getElementById('posts').innerHTML="";
        posts.forEach(post => build_post(post));
    })
}

function load_followed_posts() {
    fetch(`/load/followed`)
    .then(response => response.json())
    .then(posts => {
        document.getElementById('posts').innerHTML="";
        posts.forEach(post => build_post(post));
    })
}

function show_profile(creator_id) {
    document.querySelector('#posts').style.display = 'none';  
    document.querySelector('#profile').style.display = 'block';  
    fetch(`/load`)
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => build_post(post));
    })
}

function build_post(post) {
    const post_card = document.createElement('div');
    post_card.className = "card col col-6";

    const header = document.createElement('div');
    header.className = "card-header profile";
    header.innerHTML = post.creator_username;
    post_card.append(header);
    header.addEventListener('click', () => show_profile(post.creator_id) );

    const card_body = document.createElement('div');
    card_body.className = "card-body";
    
    const text = document.createElement('p');
    text.className = "card-text";
    text.innerHTML = post.content;
    card_body.append(text);

    const likes_row = document.createElement('div');
    likes_row.className = "row align-items-center";

    const like_icon = document.createElement('i');
    like_icon.id = `like-icon-${post.id}`;
    let heart_bg;
    if(post.liked) {
        heart_bg="";
    } else {
        heart_bg="-empty";
    }
    like_icon.className = `icon-heart${heart_bg} col-auto`;
    like_icon.addEventListener('click', () => update_like(post));
    likes_row.append(like_icon);


    const likes = document.createElement('div');
    likes.id = `likes-amount-${post.id}`;
    likes.className = "card-text likes col-auto ";
    likes.innerHTML = post.likes;
    likes_row.append(likes);

    const likes_text = document.createElement('div');
    likes_text.className = "card-text likes_text col-auto ";
    likes_text.innerHTML = " like(s)";
    likes_row.append(likes_text);

    const date = document.createElement('div');
    date.className = "blockquote-footer col-auto";
    date.innerHTML = post.created_date;
    likes_row.append(date);

    card_body.append(likes_row);    
    post_card.append(card_body);

    const row = document.createElement('div');
    row.className = "row justify-content-center";
    row.append(post_card);

    document.querySelector('#posts').append(row);
}

function update_like(post) {
    fetch(`/post/${post.id}/update_like`)
    .then(response => response.json())
    .then(response => {
        if (response.liked) {
            document.getElementById(`like-icon-${post.id}`).className = "icon-heart col-auto";
        } else {
            document.getElementById(`like-icon-${post.id}`).className = "icon-heart-empty col-auto";
        }
        document.getElementById(`likes-amount-${post.id}`).innerHTML=response.newAmount;
    })
}