const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Razorpay API Keys
const razorpay = new Razorpay({
  key_id: 'YOUR_RAZORPAY_KEY_ID',
  key_secret: 'YOUR_RAZORPAY_KEY_SECRET',
});

app.use(cors());
app.use(bodyParser.json());

// Route to Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
  const { amount } = req.body; // amount in INR

  const options = {
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    receipt: `receipt_${Math.random()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ id: order.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to Verify Razorpay Payment
app.post('/api/verify-payment', async (req, res) => {
  const { paymentId, orderId, signature } = req.body;

  const generated_signature = razorpay.utils.sha256(orderId + '|' + paymentId, 'YOUR_RAZORPAY_KEY_SECRET');

  if (generated_signature === signature) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
