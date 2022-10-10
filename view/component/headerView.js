class HeaderView {
    parentEl = document.querySelector('#root')
    theme

    render(theme) {
        this.theme = theme
        const markup = this.generateMarkup()
        this.parentEl.insertAdjacentHTML('afterbegin', markup)
    }

    generateMarkup() {
        return `
        <header class="header header__shadow">
            <div class="header__content__wrapper">
                <a href="/" data-link>Where in the world?</a>
                <div class="theme-switcher__container">
                </div>
            </div>
        </header>
        `
    }
}

export default new HeaderView()
