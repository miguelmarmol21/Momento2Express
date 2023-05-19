const mongoose = require("mongoose")
const Schema = mongoose.Schema

const rentSchema = Schema({
    plateNumber:String,
    brand:String,
    numberRent: String,
    rentDate:String,
    state: {
        type: Boolean,
        default: true,
    }
})

module.exports = mongoose.model("rents", rentSchema)