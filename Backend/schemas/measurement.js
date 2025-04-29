let measurementSchema = new Schema({
    sensorID: {
        type: String,
        required: true
    },
    measurementID: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true,
        default: new Date().toISOString().slice(0, 10)
    },
    waterlevel: {
        type: Number,
        required: true
    }
})

export { measurementSchema }