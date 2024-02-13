import { DataTypes, Sequelize,Model } from 'sequelize';

const sequelize = new Sequelize({
    host: 'localhost',
    dialect: 'postgres',
    username: 'ecommerceUser',
    password: 'root',
    database: 'EcommerceDB'
});
export class Product extends Model {
    declare id: number;
    declare name: string;
    declare description: string;
    declare price: number;
    declare category: string;
    declare stock_quantity: number;
}
export class Order extends Model {
    declare id: number;
    declare userId: number;
    declare status: string;
    declare totalPrice:number;
    declare products: Array<{
        product: Product;
        quantity: number;
    }>;
}

export class Cart extends Model{
    declare products: Array<{
        product: Product;
        quantity: number;
    }>;
    declare totalPrice:number;
    declare userid:number;
}

export function connectDb(): void {
    sequelize.authenticate().then(() => {
        console.log("Connected to database");
    }).catch((error) => {
        console.error("Test: ",error);
    });
}

export async function createTables() {
    Product.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
        },
        stock_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },{sequelize, tableName: "Product"});

    Order.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Pending',
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        products: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            defaultValue: [],
        },
    }, { sequelize, tableName: "Order" });


    Cart.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        products: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            defaultValue: [],
        },
    }, { sequelize, tableName: "Cart" });

    // Extend the Cart model with an array of products

    await Order.sync({ force: false });
    console.log("Order table created");
    await Cart.sync({ force: false });
    console.log("Cart table created");
    await Product.sync({force: false});
    console.log("Product table created");
}