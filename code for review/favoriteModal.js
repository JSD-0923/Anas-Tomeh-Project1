// opening - closing modal of favorite topics
const openFavoriteModal = () => {

    const favoriteModal = document.getElementById('favorite-modal');

    if (favoriteModal.style.display === 'none' || favoriteModal.style.display === '') {
        favoriteModal.style.display = 'block';
    } else {
        favoriteModal.style.display = 'none';
    }
}


//Adding and Deleting from Favorite modal

const favoriteButton = document.getElementById('favorite-button');
favoriteButton.addEventListener('click', openFavoriteModal)

const favoriteButtonMobile = document.getElementById('favorite-button-mobile');
favoriteButtonMobile.addEventListener('click', openFavoriteModal)

let favoriteTopics = JSON.parse(localStorage.getItem('favoriteTopics')) || [];
function updateFavoriteModal() {
    const favoriteModal = document.querySelector(".favorite-modal");

    favoriteModal.innerHTML = `
    <div class="modal-content">
        <h2>My Favourite Topics</h2>
        <div class="favorite-courses-list">
            ${
        favoriteTopics.length === 0
            ? '<span>No Favorite Topics yet</span>'
            : favoriteTopics.map(topic => `
                        <div class="favorite-course-card">
                            <div class="favorite-course-card-image-container">
                                <img class="favorite-course-image" src="../assets/Logos/${topic.image}">
                            </div>
                            <div class="favorite-course-card-body">
                                <h3>${topic.topic}</h3>
                                <div class="rating-stars">
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star-outline"></ion-icon>
                                </div>
                            </div>
                        </div>
                    `).join('')
    }
        </div>
    </div>
    `;
}


document.addEventListener('click', function (event) {
    const AddFavoriteButton = document.getElementById("add-to-favourite");
    const AddFavoriteButtonMobile = document.getElementById("add-to-favourite-mobile");

    if (event.target === AddFavoriteButton || event.target === AddFavoriteButtonMobile) {
        const topicId = topic.id;
        const index = favoriteTopics.findIndex(item => item.id === topicId);

        if (index !== -1) {
            favoriteTopics.splice(index, 1);
        } else {
            favoriteTopics.push(topic);
        }

        localStorage.setItem('favoriteTopics', JSON.stringify(favoriteTopics));

        updateFavoriteModal();
    }
});

updateFavoriteModal();




