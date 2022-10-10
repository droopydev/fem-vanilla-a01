import { debounce } from '../../helpers.js'
class SearchView {
    parentEl
    data

    render(searchQuery) {
        this.parentEl = document.querySelector('.search__wrapper')
        const markup = this.generateMarkup()
        this.parentEl.insertAdjacentHTML('afterbegin', markup)

        if (!searchQuery) return
        document.querySelector('.search__field').value = searchQuery
    }

    renderText(searchQuery) {
        document.querySelector('.search__field').value = searchQuery
    }

    generateMarkup() {
        return `
                <form class="search__form">
                    <div class="search__component">
                        <div class="search__icon__wrapper">
                            <svg class="search__icon">
                                <use href="assets/icons.svg#icon-search"></use>
                            </svg>
                        </div>
                        <label class="sr-only" for="searchbar">Search for a country...</label>
                        <input type="search" class="search__field shadow" placeholder="Search for a country..."maxlength="64" />
                    </div>
                </form>
        `
    }

    getQuery() {
        const query = this.parentEl.querySelector('.search__field').value
        return query
    }

    addHandlerSearch(handler) {
        this.parentEl = document.querySelector('.search__wrapper')
        this.parentEl.addEventListener('input', (e) => {
            handler(e)
        })
        this.parentEl.addEventListener('submit', function (e) {
            e.preventDefault()
        })
    }
}

export default new SearchView()
