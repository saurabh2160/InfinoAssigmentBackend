const mongoose = require('mongoose')


const excelSchema = new mongoose.Schema({
    sheetLink: {
        type: String,
        required: true
    },
    sheetData: {
        oldValues: [{
            type: Number
        }],
        newValues: [{
            type: Number
        }]

    }
}, { timestamps: true })

module.exports = mongoose.model('Excel', excelSchema)