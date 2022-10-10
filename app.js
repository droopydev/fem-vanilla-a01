import { router, navigateTo } from './router/router.js'
import { controlLayoutPage } from './controller.js'

// Make App listen to Data-link attribute
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('[data-link')) {
            e.preventDefault()
            navigateTo(e.target.href)
        }
    })
    controlLayoutPage()
    router()
})

// Listen to back and forward histry
window.addEventListener('popstate', router)
