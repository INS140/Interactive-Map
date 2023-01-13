//get user location
const getLocation = async () => {
    let pos = await new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej)
    })
    return [pos.coords.latitude, pos.coords.longitude]
}

export default getLocation