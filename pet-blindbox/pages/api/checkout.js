import Stripe from 'stripe';

// 💡 初始化 Stripe (使用私钥)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 后端 API 处理函数
export default async function handler(req, res) {
  // 1. 只接受 POST 请求 (安全性检查)
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { priceId, successUrl, cancelUrl } = req.body;

    // 2. 数据有效性检查
    if (!priceId) {
      return res.status(400).json({ error: 'Missing priceId.' });
    }

    // 3. 核心：调用 Stripe 接口创建支付会话
    // 这里我们使用的是 'subscription' 模式 (每月订阅)
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // 🌟 订阅模式
      payment_method_types: ['card'], // 允许信用卡支付
      line_items: [
        {
          price: priceId, // 🌟 这里填入你在 Stripe Dashboard 里创建的 Price ID
          quantity: 1,
        },
      ],
      // 支付成功/失败后的跳转地址 (使用前端传来的地址)
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // 4. 将创建好的会话 URL 返回给前端
    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Stripe Session Error:', err);
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
}