

//applying dark / light mode and changing theme button content based on theme mode
const themeMode = () => {
    const body = document.body;
    const toggleThemeModeButton = document.getElementById('toggleThemeModeButton');
    const toggleThemeModeButtonMobile = document.getElementById('toggleThemeModeButtonMobile');

    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        toggleThemeModeButton.innerHTML = '<ion-icon name="moon-outline"></ion-icon> Dark Mode';
        toggleThemeModeButtonMobile.innerHTML = '<ion-icon name="moon-outline"></ion-icon>';
    } else {
        body.classList.add('dark-mode');
        toggleThemeModeButton.innerHTML = '<ion-icon name="sunny-outline"></ion-icon> Light Mode';
        toggleThemeModeButtonMobile.innerHTML = '<ion-icon name="sunny-outline"></ion-icon>';
    }
}


// opening - closing modal of favorite topics
const openFavoriteModal = () => {

    const favoriteModal = document.getElementById('favorite-modal');

    if (favoriteModal.style.display === 'none' || favoriteModal.style.display === '') {
        favoriteModal.style.display = 'block';
    } else {
        favoriteModal.style.display = 'none';
    }
}

const favoriteButton = document.getElementById('favorite-button');
favoriteButton.addEventListener('click', openFavoriteModal)


// Fetching Topics
let topics = [];
const fetchTopics = async (searchQuery) => {
    try {
        const response = await fetch(searchQuery
            ? `https://tap-web-1.herokuapp.com/topics/list?phrase=${searchQuery}`
            : `https://tap-web-1.herokuapp.com/topics/list`);
        topics = await response.json();

        renderTopics()
    } catch (error) {
        throw error;
    }
};

// sorting topics
const sortBySelect = document.getElementById("sort-by");

const sortTopics = (sortBy) => {

    if (sortBy === 'default') {
        topics.sort((a, b) => a.id - b.id);
    }
    else if (sortBy === "topic-title") {
        topics.sort((a, b) => a.topic.localeCompare(b.topic));
    }
    else if (sortBy === "author-name") {
        topics.sort((a, b) => a.name.localeCompare(b.name));
    }
    renderTopics();
}

// Register the event listener for the "change" event
sortBySelect.addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    sortTopics(selectedValue);
});

const searchInput = document.querySelector('#searchInput');

// debounce function
const debounceInputs = (func, delay) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

// create a debounced version of the fetchTopics function
const debouncedFetchTopics = debounceInputs(fetchTopics, 300);

searchInput.addEventListener('input', (event) => {
    const searchQuery = event.target.value.trim(); // Trim whitespace
    debouncedFetchTopics(searchQuery);
});

// Rendering the Fetched Data
const renderTopics = () => {
    const loadingIndicator = document.querySelector('.loading-indicator');
    const numberOfResultsElement = document.querySelector(".number-of-results");
    const topicContainer = document.querySelector(".search-results-cards");
    const searchResults = document.querySelector('.search-results');
    const selectElement = document.getElementById("filter-by");

    try {
        loadingIndicator.style.display = "block";

        numberOfResultsElement.textContent = `"${topics.length}" Web Topics Found`;

        topicContainer.innerHTML = '';



        const filterOptions = topics.map(option => option.category).filter((category, index, self) => self.indexOf(category) === index);


        filterOptions.forEach(optionData => {
            const option = document.createElement("option");
            option.value = optionData;
            option.text = optionData;
            selectElement.appendChild(option);
        });


        topics.map((topic) => {
            const card = document.createElement("section");
            card.classList.add("course-card");
            card.setAttribute("aria-label", "single course card");

            card.innerHTML = `
                <div class="course-image-container">
                    <img class="course-image" src="./assets/Logos/${topic.image}" alt="Course Image">
                </div>
                <div class="card-info">
                    <h2 class="course-title">${topic.category}</h2>
                    <p class="language-name">${topic.topic}</p>
                    <div class="rating-stars">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star-outline"></ion-icon>
                    </div>
                    <footer>
                        <p class="author">Author: ${topic.name}</p>
                    </footer>
                </div>
                <div class="vertical-space"></div>
            `;
            topicContainer.appendChild(card);
        });

        loadingIndicator.style.display = "none";
    } catch (error) {
        searchResults.innerHTML = `<p class="error-msg">Something went wrong. Web topics failed to load</p>`;
        loadingIndicator.style.display = "none";
    }
};

// Render all topics when the page initially loads
window.onload = async function () {
    await fetchTopics();
    renderTopics();
};

