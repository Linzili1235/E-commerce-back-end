import axios from 'axios'
const fs = require('fs')

const filePath = "newData.json"

const apiURL = "http://localhost:3000/product"

const jsonData = fs.readFileSync(filePath, 'utf-8', (err, data) => {
    if (err) throw err
    console.log("Successfully read data")
})

const parsedData = JSON.parse(jsonData)

axios.post(apiURL, parsedData[0])
    .then(resp => {
        console.log(resp.data)
    }).catch(err => console.log(err))

// for (const product of parsedData) {
//     axios.post(apiURL, product)
//         .then(resp => {
//         console.log(resp.data)
//     }).catch(err => console.log(err))
// }

