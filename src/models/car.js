const mongoose = require("mongoose")
const Schema = mongoose.Schema

const carShema = Schema({
    plateNumber: String,
    brand: String,
    state: {
        type: Boolean,
        default: true,
    },
})

module.exports = mongoose.model("cars", carShema)