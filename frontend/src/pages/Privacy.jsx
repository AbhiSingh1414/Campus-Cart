import '../styles/info-pages.css';

export default function Privacy() {
  return (
    <main className="info-page">
      <header className="info-hero">
        <span className="info-eyebrow">Your information</span>
        <h1>Privacy policy</h1>
        <p>How information may be used when you browse and shop with CampusCart.</p>
      </header>
      <section className="info-card policy-copy">
        <p className="policy-updated">Last updated: October 8, 2026</p>
        <h2>Information you provide</h2>
        <p>When you use CampusCart, you may provide details such as your name, email address, delivery information, and order details. The site may also receive technical information needed to operate and protect the service.</p>
        <h2>How information is used</h2>
        <p>Information may be used to manage accounts and orders, respond to support requests, improve the site, and help prevent misuse. We do not describe a specific retention period or third-party sharing practice here; those details should be confirmed with the service operator.</p>
        <h2>Cookies and security</h2>
        <p>Your browser or the application may store data needed for site features. No online service can guarantee absolute security, so avoid sharing sensitive information through general support forms.</p>
        <h2>Your choices</h2>
        <p>For questions about your information or this policy, contact us through the <a href="/contact">Contact Us</a> page.</p>
      </section>
    </main>
  );
}
