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
}
