document.addEventListener('DOMContentLoaded', function() {
    load_posts();
});

function load_posts() {
    fetch("/load")
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
    })
}
