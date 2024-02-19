import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Your App';
  serverData: any;
  productData = { name: '', description: '', price: 0, category: '', stock_quantity: 0 };
  productIdToUpdate = 0;

  userData = { UserId: 0 };
  UserId = 0;
  usersData: any;


  cartData: any;
  ordersData: any;
  productIdToRemoveFromCart = 0;

  constructor(private http: HttpClient) { }

  getServerData() {
    this.http.get('http://localhost:3001/products').subscribe(data => {
      this.serverData = data;
    });
  }
  addProduct() {
    this.http.post('http://localhost:3001/products', this.productData).subscribe(res => {
      console.log('Product added:', res);
      // Refresh the product list
      this.getServerData();
    });
  }

  updateProduct() {
    this.http.put(`http://localhost:3001/products/${this.productIdToUpdate}`, this.productData).subscribe(res => {
      console.log('Product updated:', res);
      // Refresh the product list
      this.getServerData();
    });
  }

  deleteProduct() {
    this.http.delete(`http://localhost:3001/products/${this.productIdToUpdate}`).subscribe(res => {
      console.log('Product deleted:', res);
      // Refresh the product list
      this.getServerData();
    });
  }

  addToCart() {
    this.http.post(`http://localhost:3001/cart/${this.UserId}`, { productId: this.productIdToUpdate, quantity: 1 }).subscribe(res => {
      console.log('Product added to cart:', res);
    });
  }

  getCart() {
    this.http.get(`http://localhost:3001/cart/${this.UserId}`).subscribe(data => {
      this.cartData = data;
    });
  }

  removeFromCart() {
    this.http.delete(`http://localhost:3001/cart/${this.UserId}/item/${this.productIdToUpdate}`).subscribe(res => {
      console.log('Product removed from cart:', res);
    });
  }


  createOrder() {
    this.http.post(`http://localhost:3001/order/${this.UserId}`, {}).subscribe(res => {
      console.log('Order created:', res);
    });
  }

  getOrders() {
    this.http.get(`http://localhost:3001/order/${this.UserId}`).subscribe(data => {
      this.ordersData = data;
    });
  }
  addUser() {

    this.userData.UserId = Math.floor(Math.random() * 10000);// Generate a random id for the new user
    this.http.post('http://localhost:3001/users', this.userData).subscribe(res => {
      console.log('User added:', res);
      // Refresh the users list
      this.getUsers();
    });
  }

  getUsers() {
    this.http.get('http://localhost:3001/users').subscribe(data => {
      this.usersData = data;
    });
  }

}
