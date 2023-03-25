const commonAutoCompleteConfig = {
    /**
     * This object contains all the common configuration parameters of the
     * right and the left autocomplete widget.
     */
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}">
            ${movie.Title} 
            (${movie.Year})
        `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey: 'e70fe113',
                s: searchTerm
            }
        });
        if (response.data.Error !== undefined) {
            return [];
        }
        return response.data.Search;
    }
}

/**
 * This factory function call, is called with the commonAutoCompleteConfig
 * parameters from above (see spread operation). The custom configuration
 * of the autocomplete Feature is added only here. (reduces code duplication)
 */
createAutoComplete({
    ...commonAutoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
});

createAutoComplete({
    ...commonAutoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
});

let leftMovie;
let rightMovie;
/**
 * this function is called, when the Movie is selected from the appearing 
 * dropdown menu. It basically generates the output HTML Codes and parses
 * the data onto the DOM.
 * Furthermore this also runs the comparision task, when both sides have 
 * selected a movie.
 */
const onMovieSelect = async (movieAbstract, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: 'e70fe113',
            i: movieAbstract.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);
    (side === 'left') ? leftMovie = response.data : rightMovie = response.data;
    if (leftMovie && rightMovie) {
        runComparision();
    }
}

/**
 * This function runs the comparision betweeen the 2 sides.
 */
const runComparision = () => {

    const leftSideStatsArray = document.querySelectorAll('#left-summary .notification');
    const rightSideStatsArray = document.querySelectorAll('#right-summary .notification');

    /**
     * Contents of the stats array with each other
     * and apply the respective color scheme.
     */
    leftSideStatsArray.forEach((leftStat, index) => {
        const rightStat = rightSideStatsArray[index];
        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    })
}

const movieTemplate = (movieDetail) => {
    /**
     * Parse the data, so that it is later placed in the DOM.
     */
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = movieDetail.Awards.split(' ').reduce((previous, word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return previous;
        } else {
            return previous + value;
        }
    }, 0);

    /**
     * Return the HTML Code and classes (BULMA CSS) in which the 
     * data is parsed into (see the data-value elements in the HTML Code)
     */
    return `
        <article  class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}">
                </p>
            </figure>
            <div class="media-content">    
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>
                        ${movieDetail.Plot}
                    </p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">imdb Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">imdb Votes</p>
        </article>
    `;

}

