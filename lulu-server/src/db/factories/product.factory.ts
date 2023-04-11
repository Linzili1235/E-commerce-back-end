import { setSeederFactory } from 'typeorm-extension';
import { Product } from '../../entity/Product';
import * as slug from 'slug';

export default setSeederFactory(Product, (faker) => {
    const product = new Product();
    product.name = faker.commerce.productName();
    product.slug = slug(product.name)
    product.price = Number(faker.commerce.price());
    product.description= product.name;
    product.media = `${faker.image.avatar()}|${faker.image.avatar()}|${faker.image.avatar()}`;
    product.isActive = true;
    return product;
})
