const mongoose = require('mongoose');
const Spot = require('../models/spot');
const Review = require('../models/review');
const cities = require('./cities');
const { firstName, restaurantType, cuisine, reviewBeginning, reviewEnding } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/good-spot', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDb = async () => {
    await Spot.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 1000; i++) {
        const review = new Review({
            body: `${sample(reviewBeginning)} ${sample(reviewEnding)}`,
            rating: `${Math.floor(Math.random() * 5) + 1}`,
            author: '61eceffd2f11a9b67aad1ac7'
        });

        const randCity = sample(cities);
        const spot = new Spot({
            name: `${sample(firstName)}'s ${sample(restaurantType)}`,
            location: `${randCity.city}, ${randCity.state}`,
            geometry: {
                type: 'Point',
                coordinates: [randCity.longitude + (Math.random() / 10) - .05, randCity.latitude + (Math.random() / 10) - .05]
            },
            category: 'Restaurant',
            cuisine: `${sample(cuisine)}`,
            reviews: [],
            images: [
                {
                    url: 'https://res.cloudinary.com/dkptvfril/image/upload/v1643005723/GoodSpot/xpy4ny6wdw3rg4elywpz.png',
                    filename: 'GoodSpot/xpy4ny6wdw3rg4elywpz'
                },
                {
                    url: 'https://res.cloudinary.com/dkptvfril/image/upload/v1643005723/GoodSpot/ss0cgpsbtbyvywoippro.png',
                    filename: 'GoodSpot/ss0cgpsbtbyvywoippro'
                }
            ],
            author: '61eceffd2f11a9b67aad1ac7' //chadgud account ID
        });
        spot.reviews.push(review._id);
        review.spot = spot._id;
        await spot.save();
        await review.save();
    }

}

seedDb().then(() => {
    mongoose.connection.close();
})