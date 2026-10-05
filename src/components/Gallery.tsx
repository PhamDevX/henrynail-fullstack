"use client";

import { useEffect, useState } from "react";

const works = [
  {
    image: "nai100.jpg",
    category: "SIGNATURE",
    title: "Timeless Beauty",
    layout: "gallery-feature",
  },
  {
    image: "nai101.jpg",
    category: "DETAIL",
    title: "Soft Elegance",
    layout: "gallery-small",
  },
  {
    image: "nai102.jpg",
    category: "DETAIL",
    title: "Pure Detail",
    layout: "gallery-small",
  },
  {
    image: "nai103.jpg",
    category: "STYLE",
    title: "Modern Muse",
    layout: "gallery-small",
  },
  {
    image: "nai104.jpg",
    category: "STYLE",
    title: "Natural Glow",
    layout: "gallery-small",
  },
  {
    image: "nai105.jpg",
    category: "COLLECTION",
    title: "Made To Be Seen",
    layout: "gallery-wide",
  },
  {
    image: "nai106.jpg",
    category: "ART",
    title: "Delicate Lines",
    layout: "gallery-tall",
  },
  {
    image: "nai107.jpg",
    category: "ART",
    title: "Quiet Luxury",
    layout: "gallery-medium",
  },
  {
    image: "nai108.jpg",
    category: "DETAIL",
    title: "Everyday Chic",
    layout: "gallery-medium",
  },
  {
    image: "nai109.jpg",
    category: "SIGNATURE",
    title: "Designed For You",
    layout: "gallery-wide",
  },
  {
    image: "nai110.jpg",
    category: "STYLE",
    title: "Soft Statement",
    layout: "gallery-medium",
  },
  {
    image: "nai111.jpg",
    category: "ART",
    title: "Fine Details",
    layout: "gallery-medium",
  },
  {
    image: "nai112.jpg",
    category: "COLLECTION",
    title: "Signature Touch",
    layout: "gallery-tall",
  },
  {
    image: "nai113.jpg",
    category: "DETAIL",
    title: "Elegant Mood",
    layout: "gallery-medium",
  },
  {
    image: "nai114.jpg",
    category: "STYLE",
    title: "Modern Classic",
    layout: "gallery-medium",
  },
  {
    image: "nai115.jpg",
    category: "SIGNATURE",
    title: "Your Signature",
    layout: "gallery-feature",
  },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  useEffect(() => {
    if (!selectedImage) {
      document.body.classList.remove(
        "no-scroll"
      );

      return;
    }

    document.body.classList.add(
      "no-scroll"
    );

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.classList.remove(
        "no-scroll"
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [selectedImage]);

  return (
    <>
      <section
        id="work"
        className="work section"
      >

        <div className="section-number">
          02
        </div>

        <div className="section-header">

          <div>

            <div className="eyebrow green">
              SELECTED WORKS
            </div>

            <h2>
              A little{" "}
              <em>art</em>
              <br />
              at your fingertips.
            </h2>

          </div>

          <p>
            A curated selection
            <br />
            of HENRYNAIL
            <br />
            nail designs.
          </p>

        </div>

        <div className="gallery luxury-gallery">

          {works.map((work, index) => (
            <button
              type="button"
              key={work.image}
              className={`gallery-item ${work.layout} reveal`}
              onClick={() =>
                setSelectedImage(
                  `/images/${work.image}`
                )
              }
              aria-label={`View ${work.title}`}
            >

              <img
                src={`/images/${work.image}`}
                alt={`HENRYNAIL Nail Art ${
                  index + 1
                }`}
                loading={
                  index === 0
                    ? "eager"
                    : "lazy"
                }
              />

              <div className="gallery-caption">

                <span>
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}{" "}
                  / {work.category}
                </span>

                <strong>
                  {work.title}
                </strong>

              </div>

            </button>
          ))}

        </div>

      </section>

      {selectedImage && (
        <div
          className="lightbox active"
          role="dialog"
          aria-modal="true"
          aria-label="HENRYNAIL nail design preview"
          onClick={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedImage(null);
            }
          }}
        >

          <button
            type="button"
            className="lightbox-close"
            aria-label="Close image preview"
            onClick={() =>
              setSelectedImage(null)
            }
          >
            ×
          </button>

          <img
            className="lightbox-image"
            src={selectedImage}
            alt="HENRYNAIL nail design preview"
          />

        </div>
      )}
    </>
  );
}