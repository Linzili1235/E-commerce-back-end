const fs = require('fs')

const filePath = "../../allProduct_page1.json"

const jsonData = fs.readFileSync(filePath, 'utf-8', (err, data) => {
    if (err) throw err
    console.log("Successfully read data")
})

const parsedData = JSON.parse(jsonData)

const {rs} = parsedData
const {products} = rs

let newProducts = []

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
for (let i = 0; i<products.length; i++) {
    const product = products[i]
    const {productId, images, name, price, sizes} = product
    for (let j=0; j<images.length; j++) {
        const image = images[j]
        const {colorAlt, whyWeMadeThis} = image
        const productImg = whyWeMadeThis[0]
        const sizeArray = sizes[0].details
        sizeArray.forEach((data) => {
            const slug = generateSlug(productId, colorAlt, data)
            newProducts.push({
                productId,
                name,
                slug,
                price,
                size: data,
                img: productImg,
                color: colorAlt
            })

        })
    }
}
const newString = JSON.stringify(newProducts, null, 2)

fs.writeFileSync("newData.json", newString)




