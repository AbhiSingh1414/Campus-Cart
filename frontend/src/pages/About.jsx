import '../Styles/info-pages.css';

export default function About() {
  return (
    <main className="info-page">
      <header className="info-hero">
        <span className="info-eyebrow">Our story</span>
        <h1>About CampusCart</h1>
        <p>A simpler way to find the things you need for campus life.</p>
      </header>
      <section className="info-card">
        <h2>Made for campus life</h2>
        <p>CampusCart brings useful products together in one convenient place. Whether you are settling into a new term or picking up an everyday essential, our goal is to make browsing and shopping straightforward.</p>
        <p>We are building CampusCart around a simple idea: good shopping should feel clear, convenient, and dependable. We are glad you are here.</p>
      </section>
      <section className="info-values" aria-label="What matters to us">
        <article><span>01</span><h2>Simple</h2><p>Clear product information and an easy path from browsing to checkout.</p></article>
        <article><span>02</span><h2>Useful</h2><p>A campus-focused selection for the things you need day to day.</p></article>
        <article><span>03</span><h2>Here to help</h2><p>Questions about your order? Our contact page is the place to start.</p></article>
      </section>
    </main>
  );
}
