import { measurementSchema } from "./measurement";

let waterlevelsSchema = new Schema ({
    sensorID: {
        type: String,
        required: true
    },
    measurements: {
        type: [measurementSchema],
        required: true
    }
})

export { waterlevelsSchema }