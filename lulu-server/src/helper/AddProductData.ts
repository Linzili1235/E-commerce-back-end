// AddProductData.ts
// This file is to add product data to database
// April 19th
// Author: Jingyi Qi

import axios from 'axios'
const fs = require('fs')
const {ConcurrencyManager} = require("axios-concurrency")

// create instance to limit concurrent requests
let instance = axios.create({
    baseURL:"http://localhost:8000"
})

// a concurrency parameter of 1 makes all api requests sequential
const MAX_CONCURRENT_REQUESTS = 10;

const manager = ConcurrencyManager(instance, MAX_CONCURRENT_REQUESTS);

const filePath = "newData.json"

const jsonData = fs.readFileSync(filePath, 'utf-8', (err: any, data: any) => {
    if (err) throw err
    console.log("Successfully read data")
})

const parsedData = JSON.parse(jsonData)
const postAmount = parsedData.length / 10

for (let count = 0;  count<10; count++) {
    const addData = parsedData.splice(0, postAmount)
    Promise.all(addData.map((product: any) => instance.post('/product/', product)))
        .then(resp => {
            console.log(resp)
        }).catch(err => console.log(err))
    // axios.post('http://localhost:3000/product/', addData)
    //     .then(resp => {
    //         console.log(resp.data)
    //     }).catch(err => console.log(err))
}

// to stop using the concurrency manager.
// will eject the request and response handlers from your instance
// comment it if needed
// manager.detach()




