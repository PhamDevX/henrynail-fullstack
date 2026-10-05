"use client";

import { useEffect, useState, type MouseEvent } from "react";

type Service = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration: number;
};

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [step, setStep] = useState(1);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerInstagram, setCustomerInstagram] = useState("");

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "";

    setStep(1);
    setBookingSuccess(false);
    setSelectedService(null);

    setCustomerName("");
    setCustomerPhone("");
    setCustomerInstagram("");

    setBookingDate("");
    setBookingTime("");

    setAvailableTimes([]);
    setAvailabilityError("");

    setSubmitting(false);
  };

  useEffect(() => {
    const openHandler = () => {
      setIsOpen(true);
      setStep(1);
      setBookingSuccess(false);
      document.body.style.overflow = "hidden";
    };

    const escapeHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("open-booking", openHandler);
    document.addEventListener("keydown", escapeHandler);

    return () => {
      window.removeEventListener("open-booking", openHandler);
      document.removeEventListener("keydown", escapeHandler);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const loadServices = async () => {
      try {
        setLoadingServices(true);

        const response = await fetch("/api/services");

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();

        setServices(data);
      } catch (error) {
        console.error("Failed to load services:", error);
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !bookingDate || selectedService === null) {
      setAvailableTimes([]);
      setBookingTime("");
      setAvailabilityError("");
      return;
    }

    let cancelled = false;

    const loadAvailableTimes = async () => {
      setLoadingTimes(true);
      setAvailabilityError("");
      setAvailableTimes([]);
      setBookingTime("");

      try {
        const params = new URLSearchParams({
          date: bookingDate,
          serviceId: String(selectedService),
        });

        const response = await fetch(
          `/api/bookings/availability?${params.toString()}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error || "ไม่สามารถตรวจสอบเวลาว่างได้"
          );
        }

        if (!cancelled) {
          setAvailableTimes(result.availableTimes ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          setAvailabilityError(
            error instanceof Error
              ? error.message
              : "ไม่สามารถตรวจสอบเวลาว่างได้"
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingTimes(false);
        }
      }
    };

    loadAvailableTimes();

    return () => {
      cancelled = true;
    };
  }, [isOpen, bookingDate, selectedService]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const handleBookingSubmit = async () => {
    if (
      selectedService === null ||
      !customerName.trim() ||
      !customerPhone.trim() ||
      !bookingDate ||
      !bookingTime
    ) {
      return;
    }

    try {
      setSubmitting(true);

      const localDate = new Date(
        `${bookingDate}T${bookingTime}:00`
      );

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: customerName.trim(),
          phone: customerPhone.trim(),
          instagram: customerInstagram.trim() || null,
          serviceId: selectedService,
          date: localDate.toISOString(),
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.error ||
            `Failed to create booking (${response.status})`
        );
      }

      setBookingSuccess(true);
    } catch (error) {
      console.error("Booking error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "ไม่ทราบสาเหตุ";

      alert(`ไม่สามารถส่งการจองได้: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedServiceData = services.find(
    (service) => service.id === selectedService
  );

  return (
    <div
      className="booking-modal active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      onClick={handleBackdropClick}
    >
      <div className="booking-modal-content">

        {/* CLOSE */}
        <button
          type="button"
          className="booking-close"
          aria-label="Close booking"
          onClick={closeModal}
        >
          ×
        </button>

        {/* TOP BRAND */}
        <div className="booking-topbar">
          <div className="booking-logo">
            <img
              src="/images/henrynail-logo.png"
              alt="HENRYNAIL"
            />
          </div>

          {!bookingSuccess && (
            <div className="booking-progress">
              <span className={step >= 1 ? "active" : ""}>
                01
              </span>

              <i />

              <span className={step >= 2 ? "active" : ""}>
                02
              </span>

              <i />

              <span className={step >= 3 ? "active" : ""}>
                03
              </span>
            </div>
          )}
        </div>

        {/* HEADER */}
        {!bookingSuccess && (
          <div className="booking-header">
            <div className="booking-eyebrow">
              HENRYNAIL · APPOINTMENT
            </div>

            <h2 id="booking-title">
              Your next
              <br />
              <em>nail moment.</em>
            </h2>

            <p>
              จองเวลาของคุณกับ HENRYNAIL
              <br />
              เลือกบริการ กรอกข้อมูล และเลือกเวลาที่สะดวก
            </p>
          </div>
        )}

        {/* SUCCESS */}
        {bookingSuccess ? (
          <div className="booking-success">

            <div className="booking-success-circle">
              <span>✓</span>
            </div>

            <div className="booking-success-eyebrow">
              BOOKING RECEIVED
            </div>

            <h3>
              You&apos;re
              <br />
              <em>all set.</em>
            </h3>

            <p>
              HENRYNAIL ได้รับข้อมูลการจองของคุณแล้ว
              <br />
              กรุณารอการติดต่อกลับเพื่อยืนยันคิว
            </p>

            <div className="booking-success-info">

              <div>
                <small>SERVICE</small>
                <strong>
                  {selectedServiceData?.name || "-"}
                </strong>
              </div>

              <div>
                <small>DATE</small>
                <strong>
                  {bookingDate || "-"}
                </strong>
              </div>

              <div>
                <small>TIME</small>
                <strong>
                  {bookingTime ? `${bookingTime} น.` : "-"}
                </strong>
              </div>

            </div>

            <button
              type="button"
              className="booking-continue"
              onClick={closeModal}
            >
              DONE
              <span>×</span>
            </button>
          </div>
        ) : (
          <>
            {/* STEP 1 */}
            {step === 1 && (
              <div className="booking-step-panel">

                <div className="booking-section-head">
                  <div>
                    <span>01</span>
                    <h3>Choose your service</h3>
                  </div>

                  <p>
                    SELECT SERVICE
                  </p>
                </div>

                {loadingServices ? (
                  <div className="booking-loading">
                    <span />
                    <p>กำลังโหลดบริการ...</p>
                  </div>
                ) : services.length === 0 ? (
                  <div className="booking-empty">
                    <p>ยังไม่มีบริการในระบบ</p>
                  </div>
                ) : (
                  <div className="booking-service-grid">

                    {services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        className={`booking-service-card ${
                          selectedService === service.id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedService(service.id)
                        }
                      >
                        <div className="booking-service-card-top">
                          <span>
                            {String(service.id).padStart(2, "0")}
                          </span>

                          <div
                            className={`booking-service-check ${
                              selectedService === service.id
                                ? "active"
                                : ""
                            }`}
                          >
                            ✓
                          </div>
                        </div>

                        <div className="booking-service-card-body">
                          <strong>{service.name}</strong>

                          {service.description && (
                            <small>
                              {service.description}
                            </small>
                          )}
                        </div>

                        <div className="booking-service-card-bottom">
                          <span>
                            {service.duration} MIN
                          </span>

                          <b>↗</b>
                        </div>
                      </button>
                    ))}

                  </div>
                )}

                <div className="booking-step-footer">
                  <button
                    type="button"
                    className="booking-continue"
                    disabled={selectedService === null}
                    onClick={() => {
                      if (selectedService !== null) {
                        setStep(2);
                      }
                    }}
                  >
                    CONTINUE
                    <span>→</span>
                  </button>
                </div>

                <div className="booking-contact-list">

                  <a
                    href="https://www.instagram.com/henrynail_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="booking-contact"
                  >
                    <span className="booking-contact-number">
                      01
                    </span>

                    <span className="booking-contact-info">
                      <small>INSTAGRAM</small>
                      <strong>@henrynail_</strong>
                    </span>

                    <span className="booking-contact-arrow">
                      ↗
                    </span>
                  </a>

                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="booking-contact"
                  >
                    <span className="booking-contact-number">
                      02
                    </span>

                    <span className="booking-contact-info">
                      <small>FACEBOOK</small>
                      <strong>HENRYNAIL</strong>
                    </span>

                    <span className="booking-contact-arrow">
                      ↗
                    </span>
                  </a>

                  <a
                    href="tel:0966512207"
                    className="booking-contact"
                  >
                    <span className="booking-contact-number">
                      03
                    </span>

                    <span className="booking-contact-info">
                      <small>PHONE</small>
                      <strong>096 651 2207</strong>
                    </span>

                    <span className="booking-contact-arrow">
                      ↗
                    </span>
                  </a>

                </div>

              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="booking-step-panel">

                <div className="booking-section-head">
                  <div>
                    <span>02</span>
                    <h3>Your details</h3>
                  </div>

                  <p>
                    CONTACT
                  </p>
                </div>

                <div className="booking-selected-service">
                  <div>
                    <small>SELECTED SERVICE</small>
                    <strong>
                      {selectedServiceData?.name}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                  >
                    CHANGE
                  </button>
                </div>

                <div className="booking-form-grid">

                  <div className="booking-form-group">
                    <label htmlFor="customer-name">
                      NAME
                    </label>

                    <input
                      id="customer-name"
                      type="text"
                      placeholder="Your name"
                      value={customerName}
                      onChange={(event) =>
                        setCustomerName(event.target.value)
                      }
                    />
                  </div>

                  <div className="booking-form-group">
                    <label htmlFor="customer-phone">
                      PHONE
                    </label>

                    <input
                      id="customer-phone"
                      type="tel"
                      placeholder="Your phone number"
                      value={customerPhone}
                      onChange={(event) =>
                        setCustomerPhone(event.target.value)
                      }
                    />
                  </div>

                </div>

                <div className="booking-form-group">
                  <label htmlFor="customer-instagram">
                    INSTAGRAM
                    <span>OPTIONAL</span>
                  </label>

                  <input
                    id="customer-instagram"
                    type="text"
                    placeholder="@username"
                    value={customerInstagram}
                    onChange={(event) =>
                      setCustomerInstagram(event.target.value)
                    }
                  />
                </div>

                <div className="booking-actions">

                  <button
                    type="button"
                    className="booking-back"
                    onClick={() => setStep(1)}
                  >
                    ← BACK
                  </button>

                  <button
                    type="button"
                    className="booking-continue"
                    disabled={
                      !customerName.trim() ||
                      !customerPhone.trim()
                    }
                    onClick={() => {
                      if (
                        !customerName.trim() ||
                        !customerPhone.trim()
                      ) {
                        return;
                      }

                      setStep(3);
                    }}
                  >
                    CONTINUE
                    <span>→</span>
                  </button>

                </div>

              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="booking-step-panel">

                <div className="booking-section-head">
                  <div>
                    <span>03</span>
                    <h3>Choose your time</h3>
                  </div>

                  <p>
                    APPOINTMENT
                  </p>
                </div>

                <div className="booking-selected-service">
                  <div>
                    <small>BOOKING FOR</small>
                    <strong>
                      {selectedServiceData?.name}
                    </strong>
                  </div>

                  <span>
                    {selectedServiceData?.duration} MIN
                  </span>
                </div>

                <div className="booking-form-grid">

                  <div className="booking-form-group">
                    <label htmlFor="booking-date">
                      DATE
                    </label>

                    <input
                      id="booking-date"
                      type="date"
                      lang="th"
                      value={bookingDate}
                      onChange={(event) => {
                        setBookingDate(event.target.value);
                        setBookingTime("");
                      }}
                    />
                  </div>

                  <div className="booking-form-group">
                    <label htmlFor="booking-time">
                      TIME
                    </label>

                    <select
                      id="booking-time"
                      value={bookingTime}
                      onChange={(event) =>
                        setBookingTime(event.target.value)
                      }
                      disabled={
                        !bookingDate ||
                        loadingTimes ||
                        !!availabilityError
                      }
                    >
                      <option value="">
                        {!bookingDate
                          ? "เลือกวันที่ก่อน"
                          : loadingTimes
                          ? "กำลังตรวจสอบ..."
                          : availabilityError
                          ? "ตรวจสอบไม่สำเร็จ"
                          : availableTimes.length === 0
                          ? "ไม่มีเวลาว่าง"
                          : "เลือกเวลา"}
                      </option>

                      {availableTimes.map((time) => (
                        <option
                          key={time}
                          value={time}
                        >
                          {time} น.
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {availabilityError && (
                  <div
                    className="booking-availability-error"
                    role="alert"
                  >
                    <span>!</span>
                    <p>{availabilityError}</p>
                  </div>
                )}

                {!loadingTimes &&
                  bookingDate &&
                  !availabilityError &&
                  availableTimes.length === 0 && (
                    <div className="booking-no-time">
                      <span>—</span>
                      <p>
                        ไม่มีเวลาว่างสำหรับวันที่เลือก
                        <br />
                        กรุณาลองเลือกวันอื่น
                      </p>
                    </div>
                  )}

                <div className="booking-actions">

                  <button
                    type="button"
                    className="booking-back"
                    onClick={() => setStep(2)}
                  >
                    ← BACK
                  </button>

                  <button
                    type="button"
                    className="booking-continue"
                    disabled={
                      !bookingDate ||
                      !bookingTime ||
                      submitting
                    }
                    onClick={handleBookingSubmit}
                  >
                    {submitting
                      ? "SENDING..."
                      : "CONFIRM BOOKING"}

                    <span>→</span>
                  </button>

                </div>

              </div>
            )}
          </>
        )}

        {/* FOOTER */}
        <div className="booking-footer">
          <span>
            ต.ป่างิ้ว · เวียงป่าเป้า · เชียงราย
          </span>

          <span>
            HENRYNAIL · EST. 3 YEARS
          </span>
        </div>

      </div>
    </div>
  );
}