import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'This is a description for product 1.',
      price: 100
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'This is a description for product 2.',
      price: 200
    },
    {
      id: '3',
      name: 'Product 3',
      description: 'This is a description for product 3.',
      price: 300
    }
  ];

  newProduct: Product = {id: '', name: '', description: '', price: 0};
  updatedProduct: Product = {id: '', name: '', description: '', price: 0};
  productIdToDelete: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  createProduct(product: Product): void {
    this.productService.createProduct(product).subscribe((newProduct) => {
      this.products.push(newProduct);
    });
  }

  updateProduct(product: Product): void {
    this.productService.updateProduct(product.id, product).subscribe((updatedProduct) => {
      const index = this.products.findIndex(p => p.id === updatedProduct.id);
      this.products[index] = updatedProduct;
    });
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.products = this.products.filter(product => product.id !== id);
    });
  }
}
