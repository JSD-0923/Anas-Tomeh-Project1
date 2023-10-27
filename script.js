

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

let _data

// Fetching Topics

const fetchTopics = async (searchQuery) => {
    try {
        const response = await fetch(searchQuery
            ? `https://tap-web-1.herokuapp.com/topics/list?phrase=${searchQuery}`
            : `https://tap-web-1.herokuapp.com/topics/list`);
        let topics = await response.json();
       let filteredTopics = [...topics];

        return {
            'topics': topics,
            'filteredTopics': filteredTopics
        }

    } catch (error) {
        throw error;
    }
};


// sorting topics
const sortBySelect = document.getElementById("sort-by");

const sortTopics = (data, sortBy) => {
    if (sortBy === 'default') {
        data.sort((a, b) => a.id - b.id);
    } else if (sortBy === "topic-title") {
        data.sort((a, b) => a.topic.localeCompare(b.topic));
    } else if (sortBy === "author-name") {
        data.sort((a, b) => a.name.localeCompare(b.name));
    }
    renderTopics(data);
}


const filterTopics = (data) => {
    const filterElement = document.getElementById("filter-by");
    filterElement.innerHTML = '<option value="default">Default</option>';

    const filterOptions = data.topics.map(option => option.category).filter((category, index, self) => self.indexOf(category) === index);

    filterOptions.map(optionData => {
        const option = document.createElement("option");
        option.value = optionData;
        option.text = optionData;
        filterElement.appendChild(option);
    });

    filterElement.addEventListener('change', () => {
        const selectedValue = filterElement.value;
        let filteredTopics = selectedValue === 'default'
            ? data.topics
            : data.topics.filter(topic => topic.category === selectedValue);
        renderTopics(filteredTopics);
        _data.filteredTopics = filteredTopics;
    });
}

sortBySelect.addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    sortTopics(_data.filteredTopics, selectedValue); // Use _data.filteredTopics for sorting
});



const searchInput = document.querySelector('#searchInput');

// debounce function
const debounceInputs = (func, delay) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        return new Promise((resolve, reject) => {
            timer = setTimeout(async () => {
                try {
                    const result = await func.apply(this, args);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }, delay);
        });
    };
};

// create a debounced version of the fetchTopics function
const debouncedFetchTopics = debounceInputs(fetchTopics, 300);

searchInput.addEventListener('input', async (event) => {
    const searchQuery = event.target.value.trim(); // Trim whitespace

    try {
        const data = await debouncedFetchTopics(searchQuery);
        renderTopics(data.topics);
    } catch (error) {
        console.error(error);
    }
});

// Rendering the Fetched Data
const renderTopics = (data) => {
    const loadingIndicator = document.querySelector('.loading-indicator');
    const numberOfResultsElement = document.querySelector(".number-of-results");
    const topicContainer = document.querySelector(".search-results-cards");
    const searchResults = document.querySelector('.search-results');

    try {
        loadingIndicator.style.display = "block";

        numberOfResultsElement.textContent = data.length > 0 ? `"${data.length}" Web Topics Found` : 'No Web Topics Found !!';

        topicContainer.innerHTML = '';


        data.map((topic) => {
            const card = document.createElement("section");
            card.classList.add("course-card");
            card.setAttribute("aria-label", "single course card");

            card.innerHTML = `
    <a href="details/details.html?id=${topic.id}">
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
    </a>
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
    const data = await fetchTopics();
    _data = {
        topics: data.topics,
        filteredTopics: data.filteredTopics
    };
    renderTopics(data.filteredTopics); // Render filteredTopics
    filterTopics(data);
};


//  Re-render home page when clicking on page title

const webTopicsHeading = document.getElementById('webTopicsHeading');
webTopicsHeading.addEventListener('click', async () => {
    const data = await fetchTopics();
    renderTopics(data.topics);
    filterTopics(data)
});
