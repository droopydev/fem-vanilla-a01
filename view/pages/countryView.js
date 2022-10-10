import View from '../View.js'
import ButtonView from '../component/buttonView.js'

class CountryView extends View {
    data
    _parentEl = document.querySelector('.main')

    render(data) {
        this.data = data
        this.clear()
        const markup = this.generateMarkup(this.data)
        this._parentEl.insertAdjacentHTML('afterbegin', markup)
        const backBtn = this.generateBackButton()
        backBtn.render();
    }

    addHandlerBackButtonClick(handler) {
        let btnParentEl = document.querySelector('.country__backButton__wrapper');
        btnParentEl.addEventListener('click', (e) => {
            e.preventDefault()
            handler(e)
        });
    }
    generateBackButton() {
        const backBtnParams = {
            innerHTML: 'Back',
            btnType: 'client-side-back',
            href: '/',
            parentEl: '.country__backButton__wrapper',
            icon: 'icon-arrow-left'
        }
        return new ButtonView(backBtnParams)
    }

    generateMarkup(country) {
        const nativeName = (() => {
            if(country.name.nativeName) {
                let arr = Object.keys(country.name.nativeName).map(key => country.name.nativeName[key].common)
                let uniqueArr = [...new Set(arr)] // remove repeated common names
                return uniqueArr.length > 1 ? uniqueArr.join(', ') : uniqueArr
            }
                return "Not Available"
        })()

        const currencies = (() => {
            if (country.currencies) {
                let arr = Object.keys(country.currencies).map(key => country.currencies[key])
                let str = arr.map (currency => {
                    return `${currency.symbol ? currency.symbol : ""} ${currency.name}`
                }).join(`, `)
                return str
            }
                return "Not Available"
        })()

        console.log(country.capital)

        const capital = country.capital ? country.capital.join(", ") : "Not Available"

        const language = (() => {
            if(country.languages) {
                let arr = Object.keys(country.languages).map(key => country.languages[key]);
                let str = arr.map((lang) => {
                    return `${lang}`
                }).join(`, `);
                return str;
            }
                return "Not Available"
        })()

        const tld = country.tld ? country.tld.join(", ") : "Not Available";

        return `
            <div class="country">
                <div class="country__backButton__wrapper"></div>

                <div class="country__wrapper">
                    <div class="country__image__wrapper">
                        <img class="shadow" src="${country.flags.svg}" alt="${country.name.common} Flag">
                    </div>
                    <div class="country__description__wrapper">
                        <h1>${country.name.common}</h1>
                        <ul class="country__description__grid">
                            <li class="country__grid__colOne"><b>Native Name:</b> <span>${nativeName}</span> </li>
                            <li class="country__grid__colOne"><b>Population:</b> <span>${country.population.toLocaleString()}</span></li>
                            <li class="country__grid__colOne"><b>Region:</b> <span>${country.region}</span></li>
                            <li class="country__grid__colOne"><b>Sub Region:</b> <span>${country.subregion? country.subregion : "Unavailable"}</span></li>
                            <li class="country__grid__colOne"><b>Capital:</b> <span>${capital}</span></li>
                            <li id="country_tld" class="country__grid__colTwo"><b>Top Level Domain:</b> <span>${tld}</span></li>
                            <li id="country_currencies" class="country__grid__colTwo"><b>Currencies:</b> <span>${currencies}</span></li>
                            <li id="country_lang"class="country__grid__colTwo"><b>Languages:</b> <span>${language}</span</li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    }
}

export default new CountryView()
