import { setSeederFactory } from 'typeorm-extension';
import { Product } from '../../entity/Product';
import slug from 'slug';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

const sizes = ['XS', 'S', 'M', 'L', 'XL'];

export default setSeederFactory(Product, (faker) => {
    const randomIndex = faker.datatype.number({min: 0, max: sizes.length - 1});
    const randomSize = sizes[randomIndex];
    const product = new Product();
    product.product_real_id = uuidv4();
    product.name = faker.commerce.productName();
    product.slug = slug(product.name)
    product.price = faker.commerce.price();
    product.media = `${faker.image.avatar()}|${faker.image.avatar()}|${faker.image.avatar()}`;
    product.color = faker.internet.color();
    product.isActive = true;
    product.size = randomSize
    return product;
})
