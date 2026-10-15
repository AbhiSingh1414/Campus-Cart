import '../Styles/info-pages.css';

export default function Disclaimer() {
  return (
    <main className="info-page">
      <header className="info-hero">
        <span className="info-eyebrow">Please read</span>
        <h1>Disclaimer</h1>
        <p>A few notes about product details and using this website.</p>
      </header>
      <section className="info-card policy-copy">
        <h2>Product information</h2>
        <p>We aim to present product descriptions, images, availability, and prices clearly. Details may change, and colors or appearance can vary between screens. Please review the information shown at checkout before placing an order.</p>
        <h2>Website availability</h2>
        <p>CampusCart is provided as available. We work to keep information current and the site operating, but cannot guarantee uninterrupted access or that every page is free from errors.</p>
        <h2>External services</h2>
        <p>The site may rely on external services or link to other websites. CampusCart is not responsible for the content or availability of third-party services.</p>
        <h2>Questions</h2>
        <p>If you have a question about a product, order, or this notice, please <a href="/contact">contact us</a>.</p>
      </section>
    </main>
  );
}
