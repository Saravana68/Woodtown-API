require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

/* DB import */
const connectDB = require('./db/connect');

/* Middleware import */
const errorHandlerMiddleware = require('./middleware/error-handler');
const cookieParser = require('cookie-parser')
const NotFoundMiddleware = require('./middleware/not-found');


/* router import */
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const reviewRouter = require('./routes/reviewRoute');
const orderRouter = require('./routes/orderRoutes');


app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
//app.use(express.bodyParser());


app.get('/', (req, res) => {
    res.status(200).send('Ecommerce API');
})

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews/', reviewRouter);
app.use('/api/v1/orders', orderRouter);

app.use(NotFoundMiddleware);
app.use(errorHandlerMiddleware);



const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () => {
			console.log(`server listening at port ${port}`);
		});
	} catch (err) {
		console.log(err);
	}
};


start();