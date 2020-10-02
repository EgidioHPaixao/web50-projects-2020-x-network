document.addEventListener('DOMContentLoaded', function() {
    load_posts();
});

function load_posts() {
    fetch("/load")
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => build_post(post));
    })
}

function build_post(post) {
    const post_card = document.createElement('div');
    post_card.className = "card col col-8";

    const header = document.createElement('div');
    header.className = "card-header";
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
    likes_row.className = "row";

    const like_icon = document.createElement('i');
    like_icon.className = "icon-heart-empty";
    likes_row.append(like_icon);

    const likes = document.createElement('p');
    likes.className = "card-text col-11";
    likes.innerHTML = `${post.likes} like(s)`;
    likes_row.append(likes);

    card_body.append(likes_row);    
    post_card.append(card_body);

    const row = document.createElement('div');
    row.className = "row justify-content-center";
    row.append(post_card);

    document.querySelector('#posts').append(row);
}