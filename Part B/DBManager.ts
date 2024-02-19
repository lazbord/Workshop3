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
    declare UserId: number;
    declare status: string;
    declare totalPrice:number;
    declare products: Array<{
        product: Product;
        quantity: number;
    }>;
}

export class Cart extends Model{
    declare products: Array<{
        productId: number;
        quantity: number;
    }>;
    declare totalPrice:number;
    declare UserId:number;
}

export class User extends Model {
    declare UserId: number;
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
        UserId: {
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
        UserId: {
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
            field: 'products',
            get() {
                return this.getDataValue('products');
            },
            set(val: Array<{ productId: number; quantity: number }>) {
                this.setDataValue('products', val.map(item => ({ productId: item.productId, quantity: item.quantity })));
            },
        },
    }, { sequelize, tableName: "Cart" });

    User.init({
        UserId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
    }, { sequelize, tableName: "User" });

    await Order.sync({ force: false });
    console.log("Order table created");
    await Cart.sync({ force: false });
    console.log("Cart table created");
    await Product.sync({force: false});
    console.log("Product table created");

    await User.sync({force: false});
    console.log("User table created");
}