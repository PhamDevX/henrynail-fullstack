"use client";

export default function Contact() {
  
  const openBooking = () => {
    window.dispatchEvent(new Event("open-booking"));
  };

  return (
    <section id="contact" className="contact section">

      <div className="section-label">
        <span>05</span>
        CONTACT
      </div>

      <div className="contact-grid">

        <div className="contact-heading">

          <p className="eyebrow">
            LET'S CREATE
          </p>

          <h2>
            YOUR NEXT
            <br />
            <em>NAIL</em> STORY.
          </h2>

          <p className="contact-description">
            พร้อมสร้างลุคใหม่ที่เป็นตัวคุณหรือยัง?
            ติดต่อ HENRYNAIL เพื่อพูดคุย
            และจองคิวได้เลย
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={openBooking}
          >
            BOOK APPOINTMENT
            <span>↗</span>
          </button>

        </div>

        <div className="contact-info">

          <div className="contact-item">

            <span className="contact-label">
              LOCATION
            </span>

            <p>
              ต.ป่างิ้ว
              <br />
              อ.เวียงป่าเป้า
              <br />
              จ.เชียงราย
            </p>

          </div>

          <div className="contact-item">

            <span className="contact-label">
              SOCIAL
            </span>

            <a
              href="https://www.instagram.com/henrynail_/"
              target="_blank"
              rel="noreferrer"
            >
              INSTAGRAM ↗
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
            >
              FACEBOOK ↗
            </a>

          </div>

          <div className="contact-item">

            <span className="contact-label">
              PHONE
            </span>

            <a href="tel:0966512207">
              CALL US ↗
            </a>

          </div>

        </div>

      </div>

    </section>
  );
}