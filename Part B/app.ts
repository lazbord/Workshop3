// server.ts
import * as express from 'express';
import {Request, Response} from 'express';
import {connectDb, createTables, Product} from './DBManager';
const app = express();
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
