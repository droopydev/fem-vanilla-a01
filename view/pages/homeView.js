import View from '../View.js'

class HomeView extends View {
    _parentEl = document.querySelector('.main')

    render() {
        const markup = this.getMarkup()
        this.clear()
        // this._parentEl.innerHTML = ''
        this._parentEl.insertAdjacentHTML('afterbegin', markup)
    }

    getMarkup() {
        return `
            <div class="form-control__wrapper">
                <div class="search__wrapper"></div>
                <div class="select__wrapper"></div>
            </div>

            <div class="results__wrapper"></div>
            <div class="pagination pagination__wrapper">
                <ul class="pagination__container"></ul>
            </div>`
    }
}

export default new HomeView()
