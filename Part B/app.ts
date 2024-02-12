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
        // Create a new product with the provided data
        const newProduct = await Product.create(req.body);
        // Respond with the newly created product
        res.json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        // Retrieve the product with the specified ID from the database
        const product = await Product.findByPk(req.params.id);
        // If the product doesn't exist, respond with an error
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        // Respond with the product
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



