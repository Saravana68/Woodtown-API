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
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');


/* router import */
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const reviewRouter = require('./routes/reviewRoute');
const orderRouter = require('./routes/orderRoutes');


app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
//app.use(express.bodyParser());

app.use(express.static('./public'));
app.use(fileUpload());


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