import View from '../View.js'

class ResultsView extends View {
    parentEl
    data
    query

    render(data, query) {
        this.data = data
        this.query = query
        this.parentEl = document.querySelector('.results__wrapper')
        if (!this.data) return
        const markup = this.generateMarkup()
        this.clear()
        this.parentEl.insertAdjacentHTML('afterbegin', markup)
    }

    renderTotalNum(data) {
        if (!data.search.query) return

        let markup
        const dataSource = data.filter.filterByRegion
            ? data.render.filteredResults
            : data.render.results
        const noun = dataSource.length > 1 ? 'Countries' : 'Country'

        if (data.filter.filterByRegion) {
            markup = `<div class="results__total">${dataSource.length} ${noun} within <b>${data.filter.filterByRegion}</b> found for: <b> ${data.search.query}</b> </div>`
        } else {
            markup = `<div class="results__total">${dataSource.length} ${noun} found for: <b>${data.search.query}</b> </div>`
        }

        this.parentEl.insertAdjacentHTML('afterbegin', markup)
    }

    renderSpinner() {
        this.parentEl = document.querySelector('.results__wrapper')
        const markup = `
          <div class="spinner">
            <svg>
              <use href="assets/icons.svg#icon-loader"></use>
            </svg>
          </div>
        `
        this.clear()
        this.parentEl.insertAdjacentHTML('afterbegin', markup)
    }

    renderError(searchQuery) {
        this.parentEl = document.querySelector('.results__wrapper')
        const markup = `
        <div class="results__error__wrapper">
        <img class="results__error__image" src="../assets/search_error.svg" alt="image of search">
            <h1>We're sorry, we couldn't find a country for your search: "${searchQuery}"</h1>
            <div class="results__error__description">
            <b>Search Tips:</b>
            <p>1. Double check your search for any typos</p>
            <p>
                2. Unfortunately, our search feature can only search for queries in ASCII characters.
                <span>E.g ✅ South Korea ❌ 한국 </span>
            </p>
            </div>
        </div>
      `
        this.clear()
        this.parentEl.insertAdjacentHTML('afterbegin', markup)
    }

    renderErrorNew(searchQuery) {
        this.parentEl = document.querySelector('.results__wrapper')
        const markup = `
        <div class="results__error__wrapper">
        <div class="results__error__image"></div>
            <h1>We're sorry, we couldn't find a country for your search: "${searchQuery}"</h1>
            <div class="results__error__description">
            <b>Search Tips:</b>
            <p>1. Double check your search for any typos</p>
            <p>
                2. Unfortunately, our search feature can only search for queries in ASCII characters.
                <span>E.g ✅ South Korea ❌ 한국 </span>
            </p>
            </div>
        </div>
      `
        this.clear()
        this.parentEl.insertAdjacentHTML('afterbegin', markup)
    }

    clear() {
        this.parentEl = document.querySelector('.results__wrapper')
        this.parentEl.innerHTML = ''
    }

    generateMarkup() {
        return `
            <ul class="grid-container">
            ${this.data.map(this.generateCardMarkup).join('')}
            </ul>
        `
    }

    generateCardMarkup(country) {
        let capital = country.capital ? country.capital : 'Not Available'
        console.log(typeof country.capital)
        if (Array.isArray(country.capital)) capital = capital.join(', ')
        return `
        <li>
            <div class="card__container shadow" id=${country.name}>
                <img src="${country.image}" />
                <div class="card__text__wrapper">
                    <a class="card__link" href="/country/${country.name.toLowerCase()}" data-link>
                        ${country.name}
                    </a>
                    <ul>
                        <li><b>Population: </b>${country.population.toLocaleString()}</li>
                        <li><b>Region: </b>${country.region}</li>
                        <li><b>Capital: </b>${capital}</li>
                    </ul>
                </div>
            </div>
            </li>
        `
    }
}

export default new ResultsView()
