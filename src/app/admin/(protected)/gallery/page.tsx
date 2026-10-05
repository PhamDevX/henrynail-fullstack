"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type GalleryItem = {
  id: number;
  image: string;
  title: string;
  active: boolean;
};

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");

  const loadGallery = async () => {
    try {
      const response = await fetch("/api/gallery");

      if (!response.ok) {
        throw new Error("Failed to fetch gallery");
      }

      const data = await response.json();
      setGallery(data);
    } catch (error) {
      console.error("Failed to load gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const resetForm = () => {
    setImage("");
    setTitle("");
  };

  const addGalleryItem = async () => {
    if (!image.trim() || !title.trim()) {
      alert("กรุณากรอกชื่อและ URL รูปภาพ");
      return;
    }

    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image,
          title,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create gallery item");
      }

      const newItem = await response.json();

      setGallery((current) => [newItem, ...current]);

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add gallery item:", error);
      alert("ไม่สามารถเพิ่มรูปได้");
    }
  };

  const toggleGalleryItem = async (item: GalleryItem) => {
    try {
      const response = await fetch("/api/gallery", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          active: !item.active,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update gallery item");
      }

      const updatedItem = await response.json();

      setGallery((current) =>
        current.map((galleryItem) =>
          galleryItem.id === updatedItem.id
            ? updatedItem
            : galleryItem
        )
      );
    } catch (error) {
      console.error("Failed to update gallery item:", error);
      alert("ไม่สามารถเปลี่ยนสถานะรูปได้");
    }
  };

  const deleteGalleryItem = async (id: number) => {
    const confirmed = window.confirm(
      "ต้องการลบรูปนี้จริงหรือไม่?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/gallery", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete gallery item");
      }

      setGallery((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete gallery item:", error);
      alert("ไม่สามารถลบรูปได้");
    }
  };

  return (
     <section className="admin-content">
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">
              HENRYNAIL / ADMIN
            </span>

            <h1>Gallery</h1>

            <p>
              Manage your nail art portfolio.
            </p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={() => setShowForm(!showForm)}
          >
            + ADD IMAGE
          </button>
        </header>

        {showForm && (
          <div className="admin-panel admin-service-form">
            <div className="admin-panel-header">
              <div>
                <span className="admin-panel-eyebrow">
                  NEW IMAGE
                </span>

                <h2>Add Gallery Image</h2>
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="gallery-title">
                  TITLE
                </label>

                <input
                  id="gallery-title"
                  type="text"
                  placeholder="เช่น French Nail Art"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="gallery-image">
                  IMAGE URL
                </label>

                <input
                  id="gallery-image"
                  type="text"
                  placeholder="/images/nai106.jpg"
                  value={image}
                  onChange={(event) =>
                    setImage(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                CANCEL
              </button>

              <button
                type="button"
                className="admin-primary-button"
                onClick={addGalleryItem}
              >
                ADD IMAGE
              </button>
            </div>
          </div>
        )}

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span className="admin-panel-eyebrow">
                PORTFOLIO
              </span>

              <h2>Gallery Images</h2>
            </div>

            <span className="admin-service-count">
              {gallery.length} IMAGES
            </span>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                ...
              </div>

              <h3>Loading gallery</h3>

              <p>
                Loading gallery data...
              </p>
            </div>
          ) : gallery.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                +
              </div>

              <h3>No gallery images yet</h3>

              <p>
                Add your first image to build your
                portfolio.
              </p>
            </div>
          ) : (
            <div className="admin-gallery-grid">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className={`admin-gallery-card ${
                    item.active
                      ? ""
                      : "gallery-inactive"
                  }`}
                >
                  <div className="admin-gallery-image">
                    <img
                      src={item.image}
                      alt={item.title}
                    />

                    {!item.active && (
                      <div className="admin-gallery-overlay">
                        HIDDEN
                      </div>
                    )}
                  </div>

                  <div className="admin-gallery-info">
                    <div>
                      <span>GALLERY</span>

                      <h3>{item.title}</h3>
                    </div>

                    <div className="admin-gallery-actions">
                      <button
                        type="button"
                        className="admin-service-toggle"
                        onClick={() =>
                          toggleGalleryItem(item)
                        }
                      >
                        {item.active
                          ? "HIDE"
                          : "SHOW"}
                      </button>

                      <button
                        type="button"
                        className="admin-service-delete"
                        onClick={() =>
                          deleteGalleryItem(item.id)
                        }
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
  );
}