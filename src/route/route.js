const express = require('express');
const router = express.Router();
const { sheet_proccess, getDocument } = require('../controller/sheetsApi')


//this will use for sending data 
router.post('/sheetupdate', sheet_proccess)

//this will be used for fetch data
router.get('/getdocument/:id', getDocument)


module.exports = router