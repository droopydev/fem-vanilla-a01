import * as model from './model.js'
import { LIST_OF_FILTERS, LIST_OF_PARAMS } from './config/config.js'
import { navigateTo } from './router/router.js'

import resultsView from './view/component/resultsView.js'
import paginationView from './view/component/paginationView.js'
import headerView from './view/component/headerView.js'
import searchView from './view/component/searchView.js'
import selectorView from './view/component/selectorView.js'
import themeButtonView from './view/component/themeButtonView.js'

import countryView from './view/pages/countryView.js'
import homeView from './view/pages/homeView.js'
import error404View from './view/pages/error404View.js'

import { debounce, UpdateUrl, getParams } from './helpers.js'

/************************
 * Component Controller *
 ************************/

export const searchFunction = async () => {
    let searchInput = model.state.search.query
    model.filterRegion('')

    let newURL = new UpdateUrl()

    try {
        if (searchInput === '') {
            await model.loadAllCountries()

            newURL.deleteAllParams()
            window.history.replaceState(model.state, null, newURL.returnURL())
        } else {
            await model.loadSearchResults(searchInput)

            newURL.deleteAllParams()
            newURL.set('search', searchInput)
            window.history.replaceState(model.state, null, newURL.returnURL())
        }
        resultsView.render(model.getResultsByPage(1)) // For every new search, go back to Page One
        resultsView.renderTotalNum(model.state) // For every new search, show the numOfResutls
        paginationView.render(model.state)
        selectorView.render(model.state)

        selectorView.addHandlerOnchange(controlFilterByRegion) // Add event listenres for new Selector Options
        paginationView.addHandlerClick(controlPagination)
    } catch (err) {
        control404SearchPage()
    }

    model.state.search.isUserTyping = false // Stop window.history.replace
}

const deBounceSearch = debounce(() => searchFunction(), 500)

export const controlSearchResult = function (char) {
    resultsView.renderSpinner()
    paginationView.clear()
    selectorView.clear()

    let newURL = new UpdateUrl()
    newURL.deleteAllParams()
    newURL.set('search', char.target.value)

    // If a user is typing again, create a new entry to the History API
    if (!model.state.search.isUserTyping) {
        window.history.pushState(model.state, null, newURL.returnURL())
        model.state.search.isUserTyping = true
    } else {
        window.history.replaceState(model.state, null, newURL.returnURL())
    }
    model.state.search.query = char.target.value
    deBounceSearch()
}

export const controlFilterByRegion = function (selectedRegion) {
    model.filterRegion(selectedRegion)

    resultsView.render(model.getResultsByPage(1)) // Whenever a new filter option is selected, always reset page back to page 1
    resultsView.renderTotalNum(model.state)
    paginationView.render(model.state)

    let newURL = new UpdateUrl()
    newURL.deleteParam('page')
    newURL.deleteParam('filter')
    if (selectedRegion) newURL.set('filter', selectedRegion) // As long as selected filter option is not 'All Countries' which truthy is false, set.
    window.history.pushState(model.state, null, newURL.returnURL())
}

export const controlPagination = function (selectedPage) {
    window.scrollTo(0, 0) // Emulating page refresh

    resultsView.render(model.getResultsByPage(selectedPage))
    resultsView.renderTotalNum(model.state)
    paginationView.render(model.state)

    let newURL = new UpdateUrl()
    newURL.set('page', selectedPage)
    window.history.pushState(model.state, null, newURL.returnURL())
}

export const controlBack = function () {
    if (window.history.state) {
        let previousPageParams = {
            search: window.history.state.search.query,
            filter: window.history.state.filter.filterByRegion,
            page: window.history.state.pagination.currentPage,
        }

        let params = Object.entries(previousPageParams)
            .map(([key, value]) => {
                if (value) {
                    return `${key}=${value}`
                }
            })
            .filter(Boolean)
            .join('&')

        navigateTo(`/?${params}`)
    } else {
        navigateTo('/')
    }
}

export const controlColorTheme = function () {
    const currentTheme = document.documentElement.getAttribute(
        'data-user-color-theme'
    )
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'

    document.documentElement.setAttribute('data-user-color-theme', newTheme)
    window.localStorage.setItem('theme', newTheme)
    themeButtonView.render(newTheme)
}

/*******************
 * Page Controller *
 *******************/

export const controlLayoutPage = function () {
    const theme = localStorage.getItem('theme') || 'light'
    headerView.render(theme)
    themeButtonView.render(theme)
    themeButtonView.addHandlerClick(controlColorTheme)
}

export const controlHomePage = async function () {
    const URLparams = getParams()
    const searchQuery = URLparams.search || ''
    const pageQuery = URLparams.page || 1
    const filterQuery = URLparams.filter || ''

    homeView.render()
    resultsView.renderSpinner()

    if (searchQuery) {
        try {
            await model.loadSearchResults(searchQuery)
        } catch (err) {
            control404SearchPage()
            return
        }
    } else {
        await model.loadAllCountries()
    }

    model.filterRegion(filterQuery) // need to filter first to get total pages

    // URL params checks
    if (Object.keys(URLparams).some((param) => !LIST_OF_PARAMS.includes(param)))
        return control404Page()
    if (
        pageQuery > model.state.pagination.totalPage ||
        pageQuery < 0 ||
        (typeof pageQuery === 'string' && pageQuery.match(/^[0-9]+$/) === null)
    )
        return control404Page()
    if (!LIST_OF_FILTERS.includes(filterQuery)) return control404Page()

    resultsView.render(model.getResultsByPage(pageQuery))
    resultsView.renderTotalNum(model.state)
    searchView.render(model.state.search.query)
    selectorView.render(model.state)
    paginationView.render(model.state)

    paginationView.addHandlerClick(controlPagination)
    searchView.addHandlerSearch(controlSearchResult)
    selectorView.addHandlerOnchange(controlFilterByRegion)
}

export const controlCountryPage = async function (regexMatch) {
    let countryName = regexMatch[1]
    try {
        await model.loadCountry(countryName)
        countryView.render(model.state.render.country)
        countryView.addHandlerBackButtonClick(controlBack)
    } catch (err) {
        control404Page()
    }
}

export const control404Page = function () {
    error404View.render()
}

export const control404SearchPage = async function () {
    document.querySelector('.main').innerHTML = ''
    homeView.render()
    searchView.render(model.state.search.query)
    searchView.addHandlerSearch(controlSearchResult)
    resultsView.renderErrorNew(model.state.search.query)
}
