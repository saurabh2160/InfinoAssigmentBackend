const sheetSchema = require('../model/excelSchema')
const { getSheetData } = require('./getsheetData')
const mongoose = require('mongoose')


//this api will do the operation on incoming values and store them in data base and will also send a response
const sheet_proccess = async (req, res) => {
    try {
        let data = req.body

        //destructuring of input 
        let { number, link } = data

        //if number is not a valid number
        if (typeof number !== 'number') {
            return res.status(400).send({ status: false, msg: "number must be between 0-9" })
        }
        if (number > 9 || number < 0)
            return res.status(400).send({ status: false, msg: "number must be between 0-9" })

        const id = link.split('/')[5]
        if (!id) return res.status(400).send({ status: false, msg: "google sheet Id is missing" })

        // getting sheet id from the url provided by user and making function of google api to get values
        let oldvaluearr = await getSheetData(id)

        //some problem occurs at google api this is an exception handler
        if (oldvaluearr.status == false) {
            return res.status(400).send({ status: false, msg: "Something wrong in google sheet" })
        }

        //to make new array with updated values
        let newValueArr = []
        oldvaluearr.forEach((e) => {
            newValueArr.push(e * number)
        })

        //obj structure that will be saved inside db
        const obj = {
            sheetLink: link,
            sheetData: {
                oldValues: oldvaluearr,
                newValues: newValueArr
            }
        }
        //getting a respone from db of newly created document
        const result = await sheetSchema.create(obj)

        //send response to fronted of the document that returned from db
        return res.send({ status: true, data: result })
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ status: false, msg: e.message })
    }
}


//this api will only fetch data from data base so that it can be shown in front end
const getDocument = async (req, res) => {
    try {
        const id = req.params.id

        //incase id is invalid
        if (!mongoose.isValidObjectId(id))
            return res.status(400).send({ status: false, msg: "invalid document id" })

        //result that will be send in front end
        const result = await sheetSchema.findById(id)
        //if data is not returned from db
        if (!result)
            return res.status(404).send({ status: false, msg: "document not found" })

        //response for front end
        return res.status(200).send({ status: true, data: result })

    }
    catch (e) {
        console.log(e);
        return res.status(500).send({ status: false, msg: e.message })
    }
}
module.exports = { sheet_proccess, getDocument }