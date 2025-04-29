let floodRiskAreaSchema = new Schema ({
    id: {
        type: Number,
        required: true
    },
    coordinate: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    radius: {
        type: Number,
        required: true
    },
    riskLevel: {
        type: String,
        required: true
    },
    detailedInfo: {
        waterLevel: {
            type: String,
            required: true
        },
        probability: {
            type: String,
            required: true
        },
        timeframe: {
            type: String,
            required: true
        },
        affectedArea: {
            type: String,
            required: true
        },
        evacuationStatus: {
            type: String,
            required: true
        },
        emergencyContacts: {
            type: String,
            required: true
        }
    }
})