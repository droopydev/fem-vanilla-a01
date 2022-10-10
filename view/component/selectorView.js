class SelectorView {
    parentEl
    data
    listOfRegions = []
    selected

    render(data) {
        this.parentEl = document.querySelector('.select__wrapper')
        this.data = data

        this._listOfRegion = this.getRegions(data.render.results)
        this.selected = data.filter.filterByRegion

        const markup = this.generateMarkup()
        this.clear()
        this.parentEl.insertAdjacentHTML('afterbegin', markup)
    }

    clear() {
        this.parentEl = document.querySelector('.select__wrapper')
        this.parentEl.innerHTML = ''
    }

    addHandlerOnchange(handler) {
        let selectEl = this.parentEl.querySelector('.select')
        selectEl.addEventListener('change', (e) => {
            handler(e.target.value)
        })
    }

    getRegions(data) {
        return [...new Set(data.map((country) => country.region))]
    }

    generateMarkup() {
        return `
        <div class="select__container">
            <select class="select shadow">
            <option value="">All Regions</option>
            ${this._listOfRegion.map((region) => {
                return `<option value="${region}" ${
                    region === this.selected ? `selected="selected"` : ''
                } >${region}</option>`
            })}
            </select>
            <div class="select__icon__container">
                <svg class="select__icon">
                    <use href="assets/icons.svg#icon-arrow-bottom"></use>
                </svg>
            </div>
        </div>
        `
    }
}

export default new SelectorView()
