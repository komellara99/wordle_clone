
const PORT = 8000
const axios = require("axios").default
const express = require("express")
const cors = require("cors")
//require('dotenv').config()
const app = express()

app.use(cors())


app.get('/word', (req, res) => {
    const axios = require("axios");

    const options = {
      method: 'GET',
      url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
      params: {count: '5', wordLength: '5'},
      headers: {
        'X-RapidAPI-Key': 'b42109911dmsh100e96c18b4a4a1p112726jsn006f18e24794',
        'X-RapidAPI-Host': 'random-words5.p.rapidapi.com'
      }
    };
    
    axios.request(options).then(function (response) {
        console.log(response.data);
        res.json(response.data[0])
    }).catch(function (error) {
        console.error(error);
    });
 })

app.listen(PORT, () => console.log('Server running on port ' + PORT))