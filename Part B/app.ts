// server.ts
import * as express from 'express';
import {Request, Response} from 'express';

const app = express();
app.use(express.json());
const port = 3001;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
