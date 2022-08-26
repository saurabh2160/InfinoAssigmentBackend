const { google } = require('googleapis');
require("dotenv").config()



const getSheetData = async (id) => {
    try {
        const auth = new google.auth.GoogleAuth({
            key: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            scopes: 'https://www.googleapis.com/auth/spreadsheets'
        })
   
        const spreadsheetId = id
        //createing client instance
        const client = await auth.getClient();

        //googlesheet intance
        const googlesheets = google.sheets({ version: 'v4', auth: client })

        //get metadata of spreadsheet
        // const metaData = await googlesheets.spreadsheets.get({
        //     auth,
        //     spreadsheetId,
        // })

        //reading rows from spread sheet
        const getRows = await googlesheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: 'Sheet1!A:A'
        })
        const op = getRows.data.values.flat().map(Number)
        return op
    }
    catch (e) {
        console.log(e);
        return { status: false, msg: e.message }
    }
}

module.exports = { getSheetData }