"use client";

export default function Footer() {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-brand">

          <div className="footer-logo">
            HENRYNAIL
          </div>

          <p>
            NAIL ART · BEAUTY · STUDIO
          </p>

        </div>

        <button
          type="button"
          className="back-to-top"
          onClick={scrollTop}
        >
          BACK TO TOP
          <span>↑</span>
        </button>

      </div>

      <div className="footer-bottom">

        <span>
          © {new Date().getFullYear()} HENRYNAIL
        </span>

        <span>
          WIANG PA PAO · CHIANG RAI
        </span>

        <span>
          EST. 3 YEARS
        </span>

      </div>

    </footer>
  );
}