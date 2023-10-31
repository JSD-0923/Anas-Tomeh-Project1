
//applying dark / light mode and changing theme button content based on theme mode

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);

    const toggleDarkModeButton = document.getElementById('toggleDarkModeButton');
    toggleDarkModeButton.innerHTML = isDarkMode ? '<ion-icon name="sunny-outline"></ion-icon> Light Mode' : '<ion-icon name="moon-outline"></ion-icon> Dark Mode';

    const toggleThemeModeButtonMobile = document.getElementById('toggleDarkModeButtonMobile');
    toggleThemeModeButtonMobile.innerHTML = isDarkMode ?'<ion-icon name="sunny-outline"></ion-icon>' : '<ion-icon name="moon-outline"></ion-icon>';
}


const toggleDarkModeButton = document.getElementById('toggleDarkModeButton');
toggleDarkModeButton.addEventListener('click', toggleDarkMode);

const toggleThemeModeButtonMobile = document.getElementById('toggleDarkModeButtonMobile');
toggleThemeModeButtonMobile.addEventListener('click', toggleDarkMode);

document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    const toggleDarkModeButton = document.getElementById('toggleDarkModeButton');
    toggleDarkModeButton.innerHTML = !isDarkMode ? '<ion-icon name="moon-outline"></ion-icon> Dark Mode' : '<ion-icon name="sunny-outline"></ion-icon> Light Mode';

    const toggleThemeModeButtonMobile = document.getElementById('toggleDarkModeButtonMobile');
    toggleThemeModeButtonMobile.innerHTML = isDarkMode ?'<ion-icon name="sunny-outline"></ion-icon>' : '<ion-icon name="moon-outline"></ion-icon>';

});


// Fetch Topic

let topic;
const fetchTopic = async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const TopicId = urlParams.get("id");


    try {
        const response = await fetch(`https://tap-web-1.herokuapp.com/topics/details/${TopicId}`);
        topic = await response.json();

    } catch (error) {
        throw error;
    }
};

// Function to check if the topic is in favoriteTopics
function isTopicInFavorites(topic) {
    const favoriteTopics = JSON.parse(localStorage.getItem('favoriteTopics')) || [];
    return favoriteTopics.some(favoriteTopic => favoriteTopic.id === topic.id);
}

const renderTopic = () => {
    const loadingIndicator = document.querySelector('.loading-indicator');
    const container = document.querySelector(".container");

    try {
        loadingIndicator.style.display = "block";

        container.innerHTML = `

         <div class="web-content">
         <div class="first-content">
                <section class="course-details">
                    <h2 class="course-title">${topic.category}</h2>
                    <h2 class="language-name">${topic.topic}</h2>
                    <div class="rating-stars">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star-outline"></ion-icon>
                    </div>
                    <p class="course-description">${topic.description}</p>
                </section>
            <section class="course-card">
                <div class="course-image-container">
                    <img class="course-image" src='../assets/Logos/${topic.image}' alt="Course Image">
                </div>
                <div class="card-info">
                    <h2 >HTML by <a >${topic.name}</a></h2>
                    <div class="add-to-favorite-box">
                        <h2>Interested about this topic?</h2>
                        <button id="add-to-favourite">${isTopicInFavorites(topic) ? 'Remove from Favourites' : 'Add to Favourites'} ♡</button>
                        <p>Unlimited Credits</p>
                    </div>
                </div>
            </section>
        </div>
        <div class="second-content">
            <section class="course-topics">
                <table>
                    <thead>
                    <tr>
                        <th>HTML Sub Topics</th>
                    </tr>
                    </thead>
            <tbody>
        ${topic.subtopics.map(subtopic => `
            <tr>
                <td><ion-icon name="checkmark-circle-outline" style="color: green; padding-top: 10px;"></ion-icon> ${subtopic}</td>
            </tr>
        `).join('')}
    </tbody>
               </table>
            </section>
        </div>
    </div>
        <div class="mobile-content">
       <section class="course-card">
           <div class="course-image-container">
               <img class="course-image" src='../assets/Logos/${topic.image}' alt="Course Image">
           </div>
           <div class="card-info">
               <h2 >HTML by <a >${topic.name}</a></h2>
               <div class="add-to-favorite-box">
                   <h2>Interested about this topic?</h2>
                   <button id="add-to-favourite-mobile">${isTopicInFavorites(topic) ? 'Remove from Favourites' : 'Add to Favourites'} ♡</button>
                   <p>Unlimited Credits</p>
               </div>
           </div>
       </section>
       <section class="course-details">
           <h2 class="course-title">${topic.category}</h2>
           <h2 class="language-name">${topic.topic}</h2>
           <div class="rating-stars">
               <ion-icon name="star"></ion-icon>
               <ion-icon name="star"></ion-icon>
               <ion-icon name="star"></ion-icon>
               <ion-icon name="star"></ion-icon>
               <ion-icon name="star-outline"></ion-icon>
           </div>
           <p class="course-description">${topic.description}</p>
       </section>
       <section class="course-topics">
           <table>
    <thead>
        <tr>
            <th>HTML Sub Topics</th>
        </tr>
    </thead>
    <tbody>
        ${topic.subtopics.map(subtopic => `
            <tr>
                <td><ion-icon name="checkmark-circle-outline" style="color: green; padding-top: 10px;"></ion-icon> ${subtopic}</td>
            </tr>
        `).join('')}
    </tbody>
</table>
       </section>
        `;
        loadingIndicator.style.display = "none";
    } catch (error) {
        container.innerHTML = `<p class="error-msg">Something went wrong. Web topics failed to load ${error}</p>`;
        loadingIndicator.style.display = "none";
    }
};

// Render all topics when the page initially loads
window.onload = async function () {
    await fetchTopic();
    renderTopic();
};

