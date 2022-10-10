class ThemeButtonView {
    parentEL
    theme

    render(theme) {
        this.parentEL = document.querySelector('.theme-switcher__container')
        this.theme = theme
        const markup = this.generateMarkup()
        this.clear()
        this.parentEL.insertAdjacentHTML('afterbegin', markup)
    }

    clear() {
        this.parentEL.innerHTML = ''
    }

    addHandlerClick(handler) {
        this.parentEL.addEventListener('click', handler)
    }

    generateMarkup() {
        const textTheme = this.theme === 'light' ? 'Light Mode' : 'Dark Mode'
        const iconTheme = this.theme === 'light' ? '#icon-sun' : '#icon-moon'
        return `
            <button type="button" class="btn__text theme-switcher">
                <div class="btn__icon__wrapper">
                    <svg class="btn__icon">
                        <use href="/assets/icons.svg${iconTheme}"></use>
                        </svg>
                    </div>
                <b id="theme-text">${textTheme}</b>
            </button>
        `
    }
}

export default new ThemeButtonView()
