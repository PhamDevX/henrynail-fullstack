export default function Hero() {
  return (
    <section id="home" className="hero">

      <div className="hero-glow glow-pink"></div>
      <div className="hero-glow glow-green"></div>

      {/* LEFT */}
      <div className="hero-content">

        <div className="eyebrow">
          NAIL ART
          <span>•</span>
          BEAUTY
          <span>•</span>
          STUDIO
        </div>

        <h1>
          NAILS
          <br />
          <em>THAT</em>
          <br />
          DEFINE YOU.
        </h1>

        <p className="hero-description">
          เพราะรายละเอียดเล็กๆ
          สามารถทำให้คุณรู้สึกพิเศษ
          ในทุกครั้งที่มองมือของตัวเอง
        </p>

        <div className="hero-actions">
          <a href="#work" className="primary-button">
            EXPLORE WORK
            <span>↘</span>
          </a>
        </div>

      </div>

      {/* RIGHT */}
      <div className="hero-visual">

        <div className="image-back">
          <img
            src="/images/nai100.jpg"
            alt="HENRYNAIL nail art design"
            fetchPriority="high"
          />
        </div>

        <div className="image-main">

          <img
            src="/images/nai101.jpg"
            alt="HENRYNAIL nail design"
          />

          <div className="image-overlay">
            <div className="overlay-title">
              HENRY
            </div>

            <div className="overlay-subtitle">
              NAIL STUDIO
            </div>
          </div>

        </div>

        <div className="experience-badge">
          EST.
          <strong>3</strong>
          YEARS
        </div>

      </div>

      <div className="scroll-indicator">
        SCROLL TO DISCOVER
        <span>↓</span>
      </div>

    </section>
  );
}