const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src="${imgSrc}" />
        ${movie.Title}
    `;
    },
    inputValue(movie) {
        return movie.Title
    },
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params:{
                apikey: 'c043a71f',
                s: searchTerm
            }
        });
        if(response.data.Error){
            return [];
        };
        return response.data.Search;
    }
};

createAutoComplete({
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
    ...autoCompleteConfig
});

createAutoComplete({
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
    ...autoCompleteConfig
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, target, side) => { 
    const response = await axios.get('http://www.omdbapi.com/', {
        params:{
            apikey: 'c043a71f',
            i: movie.imdbID
        }
    });

    target.innerHTML = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll("#left-summary .notification");
    const rightSideStats = document.querySelectorAll("#right-summary .notification");

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index]
        let rightValue = parseFloat(rightStat.getAttribute("data-value"));
        const leftValue = parseFloat(leftStat.getAttribute("data-value"));
        

        if(rightValue > leftValue) {
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-warning");
        } else {
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-warning")            
        }
    });
};

const movieTemplate = (movieDetail) => {

    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metaScore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseFloat(movieDetail.imdbVotes.replace(/,/g, ''));

    const awards = movieDetail.Awards.split(' ').reduce( (prev, word) => {
        const value = parseInt(word);
        if(isNaN(value)) {
            return prev;
        } else {
            return prev += value;
        }
    }, 0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image"> 
                    <img src="${movieDetail.Poster}">
                </p>
            </figure>
            <div class="media-content">
                <div class="content"> 
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h1>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article class="notification is-primary" data-value="${awards}">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary" data-value="${dollars}">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary" data-value="${metaScore}">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary" data-value="${imdbRating}">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary" data-value="${imdbVotes}">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
};