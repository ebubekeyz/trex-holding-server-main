require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const axios = require('axios');

const connectDB = require('./db/connect');

const fileUpload = require('express-fileupload');

const authRouter = require('./routes/authRoutes');
const walletRouter = require('./routes/walletRoutes');
const penaltyRouter = require('./routes/penaltyRoutes');
const percentageRouter = require('./routes/percentageRoutes');
const earningRouter = require('./routes/earningRoutes');
const referralRouter = require('./routes/referralRoutes');
const profitRouter = require('./routes/profitRoutes');
const balanceRouter = require('./routes/balanceRoutes');
const coinRouter = require('./routes/coinRoutes');
const investRouter = require('./routes/investRoutes');
const payReceiptRouter = require('./routes/payReceiptRoutes');
const receiptRouter = require('./routes/receiptRoutes');
const withdrawRouter = require('./routes/withdrawRoutes');
const amountRouter = require('./routes/amountRoutes');
const contactRouter = require('./routes/contactRoutes');
const depositRouter = require('./routes/depositRoutes');
const userRouter = require('./routes/userRoutes');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());

app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static('./public'));
app.use(fileUpload({ useTempFiles: true }));

app.use(
  cors({
    credentials: true,
    origin: 'https://trex-holding.com',
  })
);
// app.use(
//   cors({
//     credentials: true,
//     origin: 'http://localhost:5174',
//   })
// );
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profit', profitRouter);
app.use('/api/v1/penalty', penaltyRouter);
app.use('/api/v1/percentage', percentageRouter);
app.use('/api/v1/earning', earningRouter);
app.use('/api/v1/referral', referralRouter);
app.use('/api/v1/balance', balanceRouter);
app.use('/api/v1/coin', coinRouter);
app.use('/api/v1/invest', investRouter);
app.use('/api/v1/payReceipt', payReceiptRouter);
app.use('/api/v1/receipt', receiptRouter);
app.use('/api/v1/deposit', depositRouter);
app.use('/api/v1/amount', amountRouter);
app.use('/api/v1/withdraw', withdrawRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/wallet', walletRouter);

app.get('/api/coins', async (req, res) => {
  const response = await fetch(
    'https://coinlib.io/api/v1/coinlist?key=6cb4aca8259d352f&pref=USD&page=1&order=volume_desc'
  );
  const data = await response.json();

  res.json(data);
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5200;

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(port, () => console.log(`Server is listening on port ${port}`));
};

start();
