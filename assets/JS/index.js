import getLocation from "./getLocation.js"

const root = document.querySelector('#root')

//select elements from index.html
const submit = document.querySelector('#submit')
const userSelect = document.querySelector('#business')

//Event listenr for user submit
submit.addEventListener('click', (e) => {
    map.removePlaces()
    map.business = userSelect.value
    map.findPlaces()
})
const fsqAPIKey = 'fsq3LEXMibVBYBlOvHzd31QFqPcjNIg7bTF09ZFzWqYi8pQ='

const map = {
    //coords of user
    coords: [],

    //business category
    business: null,

    //establishes map variable
    m: null,

    //user search results, used in find or remove
    searchResults: null,

    //build map
    buildMap() {
        //unpack coords
        let [lat, long] = this.coords

        //convert latLng for Leaflet
        const latLng = L.latLng(lat, long)

        // create map using user location
        this.m = L.map('map').setView(latLng, 12)

        //create tiles using openstreetmap
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 10,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.m)

        // create red pin marker
        const redPin = L.icon({
            iconUrl: './assets/images/red-pin.png',
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            popupAnchor: [0, -30]
        })

        L.marker(latLng, {icon: redPin}).addTo(this.m).bindPopup('<p>You are Here</p>').openPopup()
    },

    //find businesses and post markers on map
    findPlaces: async () => {
        let res = await fetch(`https://api.foursquare.com/v3/places/search?query=${map.business}&ll=${map.coords[0]}%2C${map.coords[1]}&radius=20000&sort=DISTANCE&limit=5`,
            {method: 'GET', headers: {accept: 'application/json', Authorization: `${fsqAPIKey}`}})
        map.searchResults = await res.json()

        //places map markers for results
        map.searchResults.results.forEach(r => {
            let ll = L.latLng(r.geocodes.main.latitude, r.geocodes.main.longitude)
            r.marker = L.marker(ll)
            r.marker.addTo(map.m).bindPopup(`<b>${r.name}</b>`)
        })
    },

    //remove markers from map
    removePlaces() {
        if (!this.searchResults) return
        this.searchResults.results.forEach(r => {
            r.marker.remove()
        })
    }
}

window.onload = async () => {
    map.coords = await getLocation()
    map.buildMap()
}


