// server.ts
import * as express from 'express';
import * as cors from 'cors';
import {Request, Response} from 'express';
import {Cart, connectDb, createTables, Order, Product} from './DBManager';

const app = express();
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(express.json());

const port = 3001;

connectDb();
createTables().then(r => {
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.get('/getServer', (req, res) => {
    const serverUrl = `localhost:${port}`;
    res.json({ code: 200, server: serverUrl });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


app.get('/products', async (req, res) => {
    try {
        // Retrieve all products from the database
        const products = await Product.findAll();
        // Respond with the list of products
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/products', async (req, res) => {
    try {
        console.log('Received POST request with body:', req.body);

        // Create a new product with the provided data
        const newProduct = await Product.create(req.body);
        console.log('New product created:', newProduct);

        // Respond with the newly created product
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error occurred while processing POST request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/products/:id', async (req, res) =>{
    try {
        // Retrieve the product with the specified id
        const product = await Product.findByPk(req.params.id);
        // If the product is found, respond with the product
        if(product){
            res.json(product);
        }
        // If the product is not found, respond with a 404 status code
        else{
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put('/products/:id', async (req, res) =>
{
    try {
        console.log('Received PUT request with body:', req.body);

        // Retrieve the product with the specified id
        const product = await Product.findByPk(req.params.id);
        // If the product is found, update it with the provided data
        if(product){
            await product.update(req.body);
            console.log('Product updated:', product);
            res.json(product);
        }
        // If the product is not found, respond with a 404 status code
        else{
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error occurred while processing PUT request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        // Retrieve the product with the specified id
        const product = await Product.findByPk(req.params.id);
        // If the product is found, delete it
        if(product){
            await product.destroy();
            console.log('Product deleted:', product);
            res.json({ message: 'Product deleted' });
        }
        // If the product is not found, respond with a 404 status code
        else{
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/cart/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { productId, quantity } = req.body;

        // Find the cart for the given userId
        let cart = await Cart.findOne({ where: { userId } });

        // If the cart doesn't exist, create a new one
        if (!cart) {
            console.log("New cart")
            cart = await Cart.create({ userId, products: [], totalPrice: 0 });
        }

        // Find the product for the given productId
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the product already exists in the cart
        const productIndex = cart.products.findIndex(item => item.productId === productId);

// If the product already exists in the cart, update its quantity
        // If the product already exists in the cart, update its quantity
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
            // Tell Sequelize that the 'products' field has changed
            cart.changed('products', true);
        } else {
            // If the product does not exist in the cart, add it to the cart
            cart.products = cart.products.concat({ productId: product.id, quantity: quantity });
        }
        // Calculate the total price of the cart
        let totalPrice = 0;
        for (const item of cart.products) {
            const product = await Product.findByPk(item.productId);
            totalPrice += product.price * item.quantity;
        }
        cart.totalPrice = totalPrice;

        // Save the updated cart
        await cart.save();

        // Return the updated cart as the response
        res.json(cart);
    } catch (error) {
        console.error('Error occurred while processing POST request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/cart/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the cart for the given userId
        let cart = await Cart.findOne({ where: { userId } });

        // If the cart doesn't exist, respond with a 404 status code
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Return the cart as the response
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/cart/:userId/item/:productId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId: number =+ req.params.productId;

        // Find the cart for the given userId
        let cart = await Cart.findOne({ where: { userId } });

        // If the cart doesn't exist, respond with a 404 status code
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find the index of the product in the cart's products array
        const productIndex = cart.products.findIndex(item => item.productId === productId);

        // If the product is not found in the cart, respond with a 404 status code
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        // Remove the product from the cart's products array
        cart.products.splice(productIndex, 1);
        // Tell Sequelize that the 'products' field has changed
        cart.changed('products', true);

        // Recalculate the total price of the cart
        let totalPrice = 0;
        for (const item of cart.products) {
            const product = await Product.findByPk(item.productId);
            totalPrice += product.price * item.quantity;
        }
        cart.totalPrice = totalPrice;

        // Save the updated cart
        await cart.save();

        // Return the updated cart as the response
        res.json(cart);
    } catch (error) {
        console.error('Error occurred while processing DELETE request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Orders
app.post('/order/:userId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        let cart = await Cart.findOne({ where: { userId } });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const order = await Order.create({
            userId,
            products: cart.products,
            totalPrice: cart.totalPrice,
        });

        // Delete the cart
        await cart.destroy();

        res.json(order);
    } catch (error) {
        console.error('Error occurred while processing POST request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/order/:userId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        const orders = await Order.findAll({ where: { userId } });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
