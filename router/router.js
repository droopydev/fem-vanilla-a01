import {
    controlCountryPage,
    controlHomePage,
    control404Page,
} from '../controller.js'
import * as model from '../model.js'

const pathToRegex = (path) =>
    new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$')

export const navigateTo = (url) => {
    history.pushState(model.state, null, url)
    router()
}

const routes = [
    { path: '/', control: controlHomePage },
    { path: '/index.html', control: controlHomePage },
    { path: '/country/:id', control: controlCountryPage },
    { path: '/404', control: control404Page },
]

export const router = function () {
    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path)),
        }
    })

    let match = potentialMatches.find(
        (potentialMatch) => potentialMatch.result !== null
    )

    // go to 404 page
    if (!match) {
        match = {
            route: routes[3], // 404
            result: [location.pathname],
        }
    }

    // 3 Get the controller to render page and URL params
    const pageController = match.route.control

    // Render the view, pass the approriate data
    if (match.route.path === '/country/:id') return pageController(match.result)

    pageController()
}
