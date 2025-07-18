export default {
  async fetch(request, env, ctx) {
    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const stripeSecretKey = env.STRIPE_SECRET_KEY; // comes from your Cloudflare secret
    const priceId = 'price_1RlY2tKnbzAulfJUd3KnJBLX'; // correct Stripe price ID

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        mode: 'payment',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        success_url: 'https://allenmmc.com/success.html',
        cancel_url: 'https://allenmmc.com/cancel.html',
      })
    });

    const data = await stripeResponse.json();

    if (!stripeResponse.ok) {
      return new Response(JSON.stringify(data), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
