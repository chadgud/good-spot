const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    spot: {
        type: Schema.Types.ObjectId,
        ref: 'Spot'
    }
});

module.exports = mongoose.model('Review', ReviewSchema)