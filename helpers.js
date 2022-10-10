const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(
                new Error(`Request took too long! Timeout after ${s} second`)
            )
        }, s * 1000)
    })
}

export const getJSON = async function (url) {
    try {
        const res = await Promise.race([fetch(url), timeout(5)])
        const data = await res.json()

        if (!res.ok) {
            const error = (data && data.message) || res.status
            return Promise.reject(error)
        }
        return data
    } catch (err) {
        console.log('hello')
        console.log(err)
        throw err
    }
}

export const debounce = (callback, wait) => {
    let timeoutId = null

    return (...args) => {
        window.clearTimeout(timeoutId)

        timeoutId = window.setTimeout(() => {
            callback.apply(null, args)
        }, wait)
    }
}

export const getParams = () => {
    let queryString = window.location.search
    let urlParams = new URLSearchParams(queryString)

    const entries = urlParams.entries()

    let paramsUrl = {}

    for (const entry of entries) {
        paramsUrl[`${entry[0]}`] = entry[1]
    }

    return paramsUrl
}

export class UpdateUrl {
    constructor() {
        this.url = new URL(window.location.href)
        this.params = new URLSearchParams(this.url.search)
    }

    deleteAllParams() {
        let params = this.params
        for (const key of params.keys()) {
            params.delete(key)
        }
        this.url.search = params
    }

    deleteParam(key) {
        this.params.delete(key)
        this.url.search = this.params
    }

    set(key, value) {
        this.params.set(key, value)
        this.url.search = this.params
    }

    append(key, value) {
        this.params.append(key, value)
        this.url.search = this.params
    }

    returnURL() {
        return this.url
    }
}
