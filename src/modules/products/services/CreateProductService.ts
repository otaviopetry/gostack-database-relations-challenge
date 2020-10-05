import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productExists = await this.productsRepository.findByName(name);

    console.log(`${productExists} -> productExists`);

    if (productExists) {
      throw new AppError(
        'A product with this exact name is already registered.',
      );
    }

    const product = await this.productsRepository.create({
      name,
      price,
      quantity,
    });

    console.log(`Service product -> ${product}`);

    return product;
  }
}

export default CreateProductService;
