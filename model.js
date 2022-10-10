import { getJSON } from './helpers.js'
import { RES_PER_PAGE, API_SEARCH_BY_NAME } from './config/config.js'

export const state = {
    render: {
        results: [],
        filteredResults: [],
        country: {},
    },
    search: {
        query: '',
        isUserTyping: false,
    },
    filter: {
        filterByRegion: '',
    },
    pagination: {
        currentPage: 1,
        totalPage: null,
        resultsPerPage: RES_PER_PAGE,
    },
}

export const loadAllCountries = async function () {
    try {
        state.search.query = ''
        state.filter.filterByRegion = ''
        let allCountriesdata = window.localStorage.getItem('All Countries')

        if (!allCountriesdata) {
            const data = await getJSON('https://restcountries.com/v3.1/all')

            state.render.results = data.map((country) => {
                console.log(country.capital)
                return {
                    name: country.name.common,
                    population: country.population,
                    region: country.region,
                    image: country.flags['png'],
                    capital:
                        Array.isArray(country.capital) &&
                        country.capital.length > 0
                            ? country.capital
                            : [],
                }
            })

            state.render.results.sort((a, b) => {
                const nameA = a.name.toUpperCase()
                const nameB = b.name.toUpperCase()
                if (nameA < nameB) {
                    return -1
                }
                if (nameA > nameB) {
                    return 1
                }
                return 0
            })

            window.localStorage.setItem(
                'All Countries',
                JSON.stringify(state.render.results)
            )
        } else {
            state.render.results = await JSON.parse(allCountriesdata)
        }
    } catch (err) {
        throw err
    }
    state.pagination.totalPage = Math.ceil(
        state.render.results.length / RES_PER_PAGE
    )
}

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query

        const data = await getJSON(`${API_SEARCH_BY_NAME}${query}`)

        state.render.results = data.map((country) => {
            return {
                name: country.name.common,
                population: country.population,
                region: country.region,
                image: country.flags['png'],
                capital:
                    Array.isArray(country.capital) && country.capital.length > 0
                        ? country.capital
                        : null,
            }
        })
    } catch (err) {
        throw err
    }

    state.pagination.totalPage = Math.ceil(state.render.results / RES_PER_PAGE)
}

export const loadCountry = async function (country) {
    try {
        let data = await getJSON(
            `${API_SEARCH_BY_NAME}${country}?fullText=true`
        )

        // Using Object Destructuring and Property Shorthand
        state.render.country = (({
            name,
            capital,
            currencies,
            flags,
            population,
            languages,
            region,
            subregion,
            border,
            tld,
        }) => ({
            name,
            capital,
            currencies,
            flags,
            population,
            languages,
            region,
            subregion,
            border,
            tld,
        }))(data[0])
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const filterRegion = function (region = state.filter.filterByRegion) {
    state.filter.filterByRegion = region

    if (!state.filter.filterByRegion) {
        state.render.filteredResults = []
        state.pagination.totalPage = Math.ceil(
            state.render.results.length / RES_PER_PAGE
        ) //Get Total Pages from full results
        return
    }

    state.render.filteredResults = state.render.results.filter(
        (country) => country.region === region
    )
    state.pagination.totalPage = Math.ceil(
        state.render.filteredResults.length / RES_PER_PAGE
    ) //Get Total Pages from filtered Results
}

export const getResultsByPage = function (page = state.pagination.currentPage) {
    state.pagination.currentPage = page

    const start = (page - 1) * RES_PER_PAGE
    const end = page * RES_PER_PAGE

    // Check for filters
    if (!state.filter.filterByRegion) {
        return state.render.results.slice(start, end)
    }

    return state.render.filteredResults.slice(start, end)
}
