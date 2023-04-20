// NewProductData.ts
// This file is to generate product data inside allProduct folder to a new modified file
// April 19th
// Author: Jingyi Qi

const fs = require('fs');
const path = require('path');

function generateSlug(productId: string, color: string, size: string): string {
    const slugParts = [productId]

    if (color) {
        slugParts.push(color)
    }
    if (size) {
        slugParts.push(size)
    }
    return slugParts.join('-')
}
async function generateDataArray() {
    const folderPath = '../../src/allProduct/';
    let newProducts = []
    // Read/write files , make API requests should use await and promises

    const files = await fs.promises.readdir(folderPath)
    // forEach will not work with await and async
    for (const file of files) {
            const filePath = path.join(folderPath, file);
            console.log(filePath);

            const jsonData = await fs.promises.readFile(filePath, 'utf-8', (err, data) => {
                if (err) throw err
                console.log("Successfully read data")
            })
            // parse every json file
            const parsedData = JSON.parse(jsonData)

            const {rs} = parsedData
            // get only product data
            const {products} = rs

            // let newProducts = []

            for (let i = 0; i<products.length; i++) {
                // every product in product list
                const product = products[i]

                // product details
                const {productId, images, name, price, sizes} = product
                // images include color and corresponding product images
                for (let j=0; j<images.length; j++) {
                    // image corresponds to every color
                    const image = images[j]
                    const {colorAlt, mainCarousel} = image
                    const {media} = mainCarousel
                    const imgSrc = media.split('|')
                    const productImg = imgSrc[0]
                    const sizeArray = sizes[0].details
                    // generate slug data for every product with unique color and size
                    let slugArray = []
                    sizeArray.forEach((data) => {
                        // every size
                        const slug = generateSlug(productId, colorAlt, data)
                        slugArray.push(slug)
                        const newProduct = {
                                productId,
                            name,
                            slug,
                            price,
                            size: data,
                            img: productImg,
                            color: colorAlt
                        }
                        // check repeated data bc that happens
                        // for object you need to check stringfy one
                        if (!newProducts.some(obj => JSON.stringify(obj) === JSON.stringify(newProduct))){
                        newProducts.push(newProduct)
                        } else {
                            console.log('repeated data')
                        }

                    })
                }
            }
            console.log("new product length", newProducts.length)
            // newProductArray.push(newProducts]
            // console.log("new product array length", newProductArray.length)

        };
    return newProducts

    }

async function writeToFileAsync(fileName){
    const newProducts = await generateDataArray()
    fs.writeFile(fileName, JSON.stringify(newProducts, null, 2), err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`ArrayI written to file`);
    });
}

writeToFileAsync("newData.json")

