const services = [
  {
    number: "01",
    title: "NAIL ART",
    description:
      "ดีไซน์เล็บที่ออกแบบตามสไตล์และความต้องการของคุณ",
  },
  {
    number: "02",
    title: "GEL NAILS",
    description:
      "สีเจลคุณภาพ พร้อมความเงางามและความคงทน",
  },
  {
    number: "03",
    title: "CUSTOM DESIGN",
    description:
      "ออกแบบลายเฉพาะตัว สำหรับคนที่อยากได้อะไรที่ไม่เหมือนใคร",
  },
  {
    number: "04",
    title: "NAIL CARE",
    description:
      "ดูแลเล็บและเตรียมหน้าเล็บอย่างใส่ใจในทุกรายละเอียด",
  },
];

export default function Services() {
  return (
    <section id="services" className="services section">

      <div className="section-label">
        <span>02</span>
        SERVICES
      </div>

      <div className="services-header">

        <div>
          <p className="eyebrow">
            WHAT WE DO
          </p>

          <h2>
            BEAUTY IN
            <br />
            <em>EVERY</em> DETAIL.
          </h2>
        </div>

        <p className="services-intro">
          เพราะเราเชื่อว่าความสวย
          ไม่จำเป็นต้องเหมือนใคร
        </p>

      </div>

      <div className="services-list">

        {services.map((service) => (
          <div
            className="service-item"
            key={service.number}
          >

            <span className="service-number">
              {service.number}
            </span>

            <h3>
              {service.title}
            </h3>

            <p>
              {service.description}
            </p>

            <span className="service-arrow">
              ↗
            </span>

          </div>
        ))}

      </div>

    </section>
  );
}