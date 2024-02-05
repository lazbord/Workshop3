// server.ts
import * as express from 'express';
import {Request, Response} from 'express';
import {connectDb, createTables} from './DBManager';
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






