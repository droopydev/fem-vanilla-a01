import View from '../View.js'
import ButtonView from '../component/buttonView.js'

class Error404View extends View {
    _parentEl = document.querySelector('.main')

    render() {
        this.clear()
        const markup = this.generateMarkup()
        this._parentEl.insertAdjacentHTML('afterbegin', markup)
        const homeButton = this.generateButton()
        homeButton.render()
    }

    generateMarkup() {
        return `
            <div class="page__error__wrapper">
                <div class="page__error__image"></div>
                <h1 class="sr-only">404 page error</h1>
                <p>Hmmm...this page doesn't exist</p>
                <div class="page__error__button">
                </div>
            </div>
            
        `
    }

    generateButton() {
        const buttonParams = {
            btnType: 'client-side-link',
            innerHTML: 'Back to Homepage',
            parentEl: '.page__error__button',
            href: '/',
        }
        return new ButtonView(buttonParams)
    }
}

export default new Error404View()
