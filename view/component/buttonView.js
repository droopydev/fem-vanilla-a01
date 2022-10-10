class ButtonView {
    constructor(params) {
        this.btnType = params.btnType
        this.href = params.href
        this.innerHTML = params.innerHTML
        this.parentEl = document.querySelector(params.parentEl)
        this.icon = params.icon || ''
        this.iconMarkUp = ''
    }

    render() {
        if (this.icon) this.iconMarkUp = this.generateMarkupIcon()
        const markup = this.generateMarkup()
        this.parentEl.insertAdjacentHTML('afterbegin', markup)
    }

    generateMarkup() {
        if (this.btnType === 'client-side-back') {
            return `<a href=${this.href} class="btn shadow" data-link-back>${this.iconMarkUp}${this.innerHTML}</a>`
        } else if (this.btnType === 'client-side-link') {
            return `<a href=${this.href} class="btn shadow" data-link>${this.iconMarkUp}${this.innerHTML}</a>`
        }
    }

    generateMarkupIcon() {
        return `
            <div class="btn__icon__wrapper">
                <svg class="btn__icon">
                    <use href="../../assets/icons.svg#${this.icon}"></use>
                </svg>
            </div>
        `
    }
}

export default ButtonView
