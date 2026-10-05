"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Service = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  active: boolean;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const loadServices = async () => {
    try {
      const response = await fetch("/api/services");

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setDuration("");
  };

  const createService = async () => {
    if (!name.trim() || !duration) {
      alert("กรุณากรอกชื่อบริการและระยะเวลา");
      return;
    }

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price,
          duration,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create service");
      }

      const newService = await response.json();

      setServices((current) => [...current, newService]);

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create service:", error);
      alert("ไม่สามารถเพิ่มบริการได้");
    }
  };

  const toggleService = async (service: Service) => {
    try {
      const response = await fetch("/api/services", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: service.id,
          active: !service.active,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update service");
      }

      const updatedService = await response.json();

      setServices((current) =>
        current.map((item) =>
          item.id === updatedService.id
            ? updatedService
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update service:", error);
      alert("ไม่สามารถเปลี่ยนสถานะบริการได้");
    }
  };

  const deleteService = async (id: number) => {
    const confirmed = window.confirm(
      "ต้องการลบบริการนี้จริงหรือไม่?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/services", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      setServices((current) =>
        current.filter((service) => service.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert("ไม่สามารถลบบริการได้");
    }
  };

  return (
  <>
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">
              HENRYNAIL / ADMIN
            </span>

            <h1>Services</h1>

            <p>
              Manage nail services and pricing.
            </p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={() => setShowForm(!showForm)}
          >
            + ADD SERVICE
          </button>
        </header>

        {showForm && (
          <div className="admin-panel admin-service-form">
            <div className="admin-panel-header">
              <div>
                <span className="admin-panel-eyebrow">
                  NEW SERVICE
                </span>

                <h2>Add Service</h2>
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="service-name">
                  SERVICE NAME
                </label>

                <input
                  id="service-name"
                  type="text"
                  placeholder="เช่น Gel Polish"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="service-price">
                  PRICE
                </label>

                <input
                  id="service-price"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={price}
                  onChange={(event) =>
                    setPrice(event.target.value)
                  }
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="service-duration">
                  DURATION / MINUTES
                </label>

                <input
                  id="service-duration"
                  type="number"
                  min="1"
                  placeholder="60"
                  value={duration}
                  onChange={(event) =>
                    setDuration(event.target.value)
                  }
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label htmlFor="service-description">
                  DESCRIPTION
                </label>

                <textarea
                  id="service-description"
                  placeholder="รายละเอียดบริการ"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={4}
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
                onClick={createService}
              >
                CREATE SERVICE
              </button>
            </div>
          </div>
        )}

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span className="admin-panel-eyebrow">
                SERVICES
              </span>

              <h2>All Services</h2>
            </div>

            <span className="admin-service-count">
              {services.length} SERVICES
            </span>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                ...
              </div>

              <h3>Loading services</h3>

              <p>
                Loading service data...
              </p>
            </div>
          ) : services.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                +
              </div>

              <h3>No services yet</h3>

              <p>
                Add your first service to get started.
              </p>
            </div>
          ) : (
            <div className="admin-services-list">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`admin-service-card ${
                    service.active
                      ? ""
                      : "service-inactive"
                  }`}
                >
                  <div className="admin-service-info">
                    <span className="admin-booking-label">
                      SERVICE
                    </span>

                    <h3>{service.name}</h3>

                    <p>
                      {service.description ||
                        "No description"}
                    </p>
                  </div>

                  <div className="admin-service-meta">
                    <div>
                      <span>PRICE</span>

                      <strong>
                        ฿{service.price.toLocaleString()}
                      </strong>
                    </div>

                    <div>
                      <span>DURATION</span>

                      <strong>
                        {service.duration} MIN
                      </strong>
                    </div>
                  </div>

                  <div className="admin-service-actions">
                    <span
                      className={`admin-service-status ${
                        service.active
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {service.active
                        ? "ACTIVE"
                        : "INACTIVE"}
                    </span>

                    <button
                      type="button"
                      className="admin-service-toggle"
                      onClick={() =>
                        toggleService(service)
                      }
                    >
                      {service.active
                        ? "DISABLE"
                        : "ENABLE"}
                    </button>

                    <button
                      type="button"
                      className="admin-service-delete"
                      onClick={() =>
                        deleteService(service.id)
                      }
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
  </>
  );
}