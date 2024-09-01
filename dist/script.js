
const apiKey_From_GnewKey_02 = '93fd9af88f67a3a8eec050fd1c5004a0'

const newsContainer = document.getElementById('news-container');
const categoryButtons = document.querySelectorAll('#category-btn');
const hightLightText = document.getElementById('highlight-text')


//Check the current excuted news 
const checkDefault = (category) => {
    const firstLoad = localStorage.getItem('directory');
    if (firstLoad == category) return true;
    else {
        localStorage.setItem('directory', category)
        return false;
    }
}


// display card for containe image url data
function displayNewsWithImages(articles) {

    newsContainer.innerHTML = '';
    articles.forEach(article => {
        const newDiv = document.createElement('div');
        newDiv.className = `bg-white cursor-pointer  dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative`

        newDiv.innerHTML = `<img src=${article.image == null ? 'https://via.placeholder.com/400x200' : `${article.image}`} alt="Card Image"
                        class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h3 class="text-lg font-semibold mb-2">${article.title}</h3>
                        <p class="text-gray-800 dark:text-gray-400">${article.description}</p>
                    </div>
                     <div class='absolute top-0 right-0 w-auto h-auto px-4 py-1 dark:text-white text-white bg-green-900'>source: ${article.source.name}</div>
        `



        newDiv.addEventListener('click', (e) => {
            if (article.url) {
                window.location.href = article.url;
            }
        })
        newsContainer.appendChild(newDiv)
    })
}


//Default headlines 
function yourFirstLoadFunction() {
    async function Headlines(source = 'general') {
        newsContainer.innerHTML = loader(`${source}`)
        hightLightText.textContent = `${source}`
        localStorage.setItem('directory', 'general')
        try {
            const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=${source}&lang=en&country=in&max=10&apikey=${apiKey_From_GnewKey_02}`)
            const data = await response.json();
            console.log(data)
            displayNewsWithImages(data.articles)
        } catch (error) {
            console.log('error while fetchin bbc news Function name is :sourceNews', error)
        }

    }
    Headlines()
}
// Run the check on page load
window.addEventListener('load', yourFirstLoadFunction);


// loadre function 
function loader(category = 'News') {
    return `<div class='text-3xl text-nowrap'> ${category} News is loading...</div>`
}


function GnewsApi() {
    const searchInput = document.getElementById('search-input')
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            newsContainer.innerHTML = loader(`${query} is loading`)
            if (query.length > 0) {
                queryNews(query);
            }
            searchInput.value = ''; // Clear the input after the search
        }
    })

    async function queryNews(params = 'news') {
        hightLightText.innerHTML = `${params}`
        const res = await fetch(`https://gnews.io/api/v4/search?q=${params}&apikey=${apiKey_From_GnewKey_02}`)
        const data = await res.json();
        console.log(data)
        displayNewsWithImages(data.articles)
    }

    //Top Headlines Endpoints 
    async function Headlines(source = 'general') {
        newsContainer.innerHTML = loader(`${source}`)
        hightLightText.textContent = `${source}`

        try {
            const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=${source}&lang=en&country=${'in'}&max=15&apikey=${apiKey_From_GnewKey_02}`)
            const data = await response.json();
            displayNewsWithImages(data.articles)
        } catch (error) {
            console.log('error while fetchin bbc news Function name is :sourceNews', error)
        }

    }

    // Event listeners for navigation buttons 
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            if (category) {
                if (!checkDefault(category)) {
                    Headlines(category);
                }
            }
            else {
                newsContainer.innerHTML = 'Working...'
            }

        })
    })

}

GnewsApi();