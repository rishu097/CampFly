const mongoose = require('mongoose');
const cities = require('./indCity');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapBoxToken = ;
const geocoder = mbxGeocoding({ accessToken: 'pk.eyJ1IjoicmlzaHUwOTciLCJhIjoiY2xqMHpsNXo2MTZxdzNncWY4bWp3ZmRwNiJ9.G0-pGNo172el5H26zKHFsw'});

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const geoData = await geocoder.forwardGeocode({
            query: cities[random1000].city,
            limit: 1
        }).send()
        const price = Math.floor(Math.random() * 1500) + 1000;
        const camp = new Campground({
            author: '648c8ea07f6e114270b274e3',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: geoData.body.features[0].geometry,
            //     type: "Point",
            //     coordinates: geoData.body.features[0].geometry
                    
            //     // campground.geometry = geoData.body.features[0].geometry;
            // },
            images: [
                {
                    url: 'https://res.cloudinary.com/dyfiupqwd/image/upload/v1687086558/YelpCamp/ascwg7u6ei0nx3x98yej.jpg',
                    filename: 'YelpCamp/ascwg7u6ei0nx3x98yej'
                },
                {
                    url: 'https://res.cloudinary.com/dyfiupqwd/image/upload/v1687086562/YelpCamp/w5xptwpfdoleb5ya5ov5.jpg',
                    filename: 'YelpCamp/w5xptwpfdoleb5ya5ov5'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})