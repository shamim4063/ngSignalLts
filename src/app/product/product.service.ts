import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductOutputDto } from '../models/products.output.dto';

@Injectable()
export class ProductService {
  protected http = inject(HttpClient);
  private readonly dummyApiUrl = 'https://dummyjson.com/';

  getProducts(limit: number, skip: number, text?: string) {
    const queryParams = `limit=${limit}&skip=${skip}&select=id,title,brand,price`;
    let apiUrl = text && text.trim().length ?
      `${this.dummyApiUrl}products/search?${queryParams}&q=${text}` : `${this.dummyApiUrl}products?${queryParams}`;

    return this.http.get<ProductOutputDto>(apiUrl);
  }

}
