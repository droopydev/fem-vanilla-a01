import { RES_PER_PAGE } from '../../../config/config.js'

class PaginationView {
    parentEl
    data

    render(data) {
        this.data = data
        this.parentEl = document.querySelector('.pagination__container')
        if (!this.data) return

        // Check for filters
        let renderArr = []
        renderArr = !this.data.filter.filterByRegion
            ? this.data.render.results
            : this.data.render.filteredResults

        const numOfPagination = Math.ceil(renderArr.length / RES_PER_PAGE)
        const markup = this.generateMarkup(numOfPagination)
        this.clear()
        this.parentEl.insertAdjacentHTML('afterbegin', markup)
    }

    clear() {
        this.parentEl = document.querySelector('.pagination__container')
        this.parentEl.innerHTML = ''
    }

    addHandlerClick(handler) {
        this.parentEl.addEventListener('click', function (e) {
            const btn = e.target.closest('.pagination__btn')
            if (!btn) return

            const goToPage = +btn.dataset.goto

            handler(goToPage)
        })
    }

    generateMarkup(numOfPagination) {
        let buttonMarkup = ''

        for (let i = 1; i <= numOfPagination; i++) {
            buttonMarkup = buttonMarkup + this.generateButtonMarkup(i)
        }

        return buttonMarkup
    }

    generateButtonMarkup(num) {
        if (+this.data.pagination.currentPage === num) {
            return `<li><button class="pagination__btn shadow pagination__btn__active" disabled data-goto="${num}">${num}</button></li>`
        }
        return `<li><button class="pagination__btn shadow" data-goto="${num}">${num}</button></li>`
    }
}

export default new PaginationView()
