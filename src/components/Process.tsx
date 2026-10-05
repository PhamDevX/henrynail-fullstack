const steps = [
  {
    number: "01",
    title: "CONSULT",
    description:
      "พูดคุยเกี่ยวกับสไตล์ สี และดีไซน์ที่คุณต้องการ",
  },
  {
    number: "02",
    title: "DESIGN",
    description:
      "เลือกและปรับรายละเอียดให้เหมาะกับคุณมากที่สุด",
  },
  {
    number: "03",
    title: "CREATE",
    description:
      "ลงมือสร้างสรรค์ผลงานด้วยความใส่ใจในทุกรายละเอียด",
  },
  {
    number: "04",
    title: "ENJOY",
    description:
      "พร้อมออกไปใช้ชีวิตด้วยเล็บที่เป็นตัวคุณ",
  },
];

export default function Process() {
  return (
    <section className="process section">

      <div className="section-label">
        <span>04</span>
        OUR PROCESS
      </div>

      <div className="process-header">

        <div>
          <p className="eyebrow">
            HOW IT WORKS
          </p>

          <h2>
            FROM IDEA
            <br />
            <em>TO</em> REALITY.
          </h2>
        </div>

        <p>
          ทุกขั้นตอนถูกออกแบบมาเพื่อให้
          ประสบการณ์ของคุณเป็นเรื่องง่าย
          และเป็นส่วนตัวที่สุด
        </p>

      </div>

      <div className="process-list">

        {steps.map((step) => (
          <div
            className="process-item"
            key={step.number}
          >

            <span className="process-number">
              {step.number}
            </span>

            <div className="process-content">

              <h3>
                {step.title}
              </h3>

              <p>
                {step.description}
              </p>

            </div>

            <span className="process-arrow">
              ↗
            </span>

          </div>
        ))}

      </div>

    </section>
  );
}