import '../styles/info-pages.css';

export default function Return() {
  return (
    <main className="info-page">
      <header className="info-hero">
        <span className="info-eyebrow">Orders &amp; support</span>
        <h1>Return policy</h1>
        <p>Need help with an item? Start by getting in touch with our team.</p>
      </header>
      <section className="info-card policy-copy">
        <h2>How to request a return</h2>
        <p>Contact us with your order details and a brief description of the issue. We will review your request and share the available next steps for your order.</p>
        <h2>Before you reach out</h2>
        <p>Please keep your order confirmation and the item’s packaging, if available. If an item arrived damaged or incorrect, include a description and photos so we can understand what happened.</p>
        <h2>Eligibility and timing</h2>
        <p>Return eligibility and any applicable time limits can depend on the product and order. Please contact us promptly after delivery; we will confirm the options that apply to your purchase.</p>
        <a className="info-button" href="/contact">Contact us about an order</a>
      </section>
    </main>
  );
}
