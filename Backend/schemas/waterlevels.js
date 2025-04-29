import { measurementSchema } from "./measurement";

let waterlevelsSchema = new Schema ({
    sensorID: {
        type: String,
        required: true
    },
    measurements: {
        type: [measurementSchema],
        required: true,
        validate: [arrayLimit, '{PATH} exceeds the limit of 3']
    }
})

function arrayLimit(val) {
    return val.length <= 3;
}

export { waterlevelsSchema }
