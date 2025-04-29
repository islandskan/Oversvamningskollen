let measurementSchema = new Schema({
    sensorID: {
        type: String,
        required: true
    },
    measurementID: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    waterlevel: {
        type: Number,
        required: true
    }
})

export { measurementSchema }