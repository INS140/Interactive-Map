const fetchAll = (...urls) => {
    let prom = []
    urls.forEach(url => {
        let promise = fetch(url)
        prom.push(promise.then(res => res.json()))
    })
    return Promise.all(prom)
}