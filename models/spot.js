const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const options = { toJSON: { virtuals: true } };

const SpotSchema = new Schema({
    name: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: String,
    cuisine: String,
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, options);

SpotSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/spots/${this._id}">${this.name}</a></strong><p>${this.location}</p><p>${this.cuisine}</p>`;
});

SpotSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
})

module.exports = mongoose.model('Spot', SpotSchema);