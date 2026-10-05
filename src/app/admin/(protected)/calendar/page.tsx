
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Booking = {
  id: number;
  date: string;
  status: string;
  customer: {
    name: string;
    phone: string | null;
  };
  service: {
    name: string;
    duration: number;
  };
};

type Holiday = {
  id: number;
  dateKey: string;
  reason: string | null;
};

const statusLabels: Record<string, string> = {
  PENDING: "รอยืนยัน",
  CONFIRMED: "ยืนยันแล้ว",
  COMPLETED: "เสร็จสิ้น",
  CANCELLED: "ยกเลิก",
};

function getDateKey(value: string | Date) {
  const date = new Date(value);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [holidayLoading, setHolidayLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(() =>
    getDateKey(new Date())
  );

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [bookingResponse, holidayResponse] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/holidays"),
      ]);

      if (!bookingResponse.ok) {
        throw new Error("โหลดข้อมูลการจองไม่สำเร็จ");
      }

      if (!holidayResponse.ok) {
        throw new Error("โหลดข้อมูลวันหยุดไม่สำเร็จ");
      }

      const bookingData = await bookingResponse.json();
      const holidayData = await holidayResponse.json();

      setBookings(bookingData);
      setHolidays(holidayData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const selectedHoliday = holidays.find(
    (holiday) => holiday.dateKey === selectedDate
  );

  const days = useMemo(() => {
    const firstDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();

    const totalDays = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();

    return [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: totalDays }, (_, index) => index + 1),
    ];
  }, [currentMonth]);

  const selectedBookings = useMemo(() => {
    return bookings
      .filter((booking) => getDateKey(booking.date) === selectedDate)
      .sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [bookings, selectedDate]);

  function changeMonth(offset: number) {
    setCurrentMonth(
      (month) =>
        new Date(month.getFullYear(), month.getMonth() + offset, 1)
    );
  }

  async function addHoliday() {
    setHolidayLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateKey: selectedDate,
          reason: reason.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "ตั้งวันหยุดไม่สำเร็จ");
      }

      setHolidays((current) => [
        ...current.filter((holiday) => holiday.dateKey !== selectedDate),
        data,
      ]);

      setReason("");
      setMessage("ตั้งวันหยุดเรียบร้อยแล้ว");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ตั้งวันหยุดไม่สำเร็จ"
      );
    } finally {
      setHolidayLoading(false);
    }
  }

  async function removeHoliday() {
    setHolidayLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/holidays", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateKey: selectedDate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "ยกเลิกวันหยุดไม่สำเร็จ");
      }

      setHolidays((current) =>
        current.filter((holiday) => holiday.dateKey !== selectedDate)
      );

      setMessage("ยกเลิกวันหยุดแล้ว");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ยกเลิกวันหยุดไม่สำเร็จ"
      );
    } finally {
      setHolidayLoading(false);
    }
  }

  return (
    <div className="calendar-page">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">HENRYNAIL / ADMIN</span>
          <h1>Booking Calendar</h1>
          <p>ปฏิทินนัดหมายและจัดการวันหยุดร้าน</p>
        </div>
      </header>

      <div className="calendar-layout">
        <section className="calendar-panel">
          <div className="calendar-heading">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="เดือนก่อน"
            >
              ‹
            </button>

            <h2>
              {currentMonth.toLocaleDateString("th-TH", {
                month: "long",
                year: "numeric",
              })}
            </h2>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="เดือนถัดไป"
            >
              ›
            </button>
          </div>

          <div className="calendar-grid">
            {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map(
              (day, index) => (
                <div
                  key={`${day}-${index}`}
                  className="calendar-weekday"
                >
                  {day}
                </div>
              )
            )}

            {days.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="calendar-cell empty"
                  />
                );
              }

              const key = getDateKey(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                )
              );

              const dayBookings = bookings.filter(
                (booking) =>
                  getDateKey(booking.date) === key &&
                  booking.status !== "CANCELLED"
              );

              const isHoliday = holidays.some(
                (holiday) => holiday.dateKey === key
              );

              return (
                <button
                  key={key}
                  type="button"
                  className={`calendar-cell ${
                    selectedDate === key ? "selected" : ""
                  } ${isHoliday ? "holiday-cell" : ""}`}
                  onClick={() => {
                    setSelectedDate(key);
                    setMessage("");
                    setError("");
                  }}
                  aria-label={`${day}${isHoliday ? " ร้านหยุด" : ""}`}
                >
                  <span>{day}</span>

                  {isHoliday ? (
                    <span className="holiday-marker">หยุด</span>
                  ) : dayBookings.length > 0 ? (
                    <span className="booking-dot">
                      {dayBookings.length}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span>
              <i className="dot pending" /> รอยืนยัน
            </span>
            <span>
              <i className="dot confirmed" /> ยืนยันแล้ว
            </span>
            <span>
              <i className="dot completed" /> เสร็จสิ้น
            </span>
            <span>
              <i className="dot holiday-dot" /> ร้านหยุด
            </span>
          </div>
        </section>

        <section className="calendar-panel appointments-panel">
          <span className="admin-panel-eyebrow">
            DAILY APPOINTMENTS
          </span>

          <h2>
            {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
              "th-TH",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </h2>

          <div className="holiday-manager">
            <h3>จัดการวันหยุดร้าน</h3>

            {selectedHoliday ? (
              <>
                <p className="holiday-current">
                  ร้านหยุดในวันนี้
                </p>

                {selectedHoliday.reason && (
                  <p className="holiday-reason">
                    เหตุผล: {selectedHoliday.reason}
                  </p>
                )}

                <button
                  type="button"
                  className="holiday-action-button reopen"
                  onClick={removeHoliday}
                  disabled={holidayLoading}
                >
                  {holidayLoading
                    ? "กำลังบันทึก..."
                    : "ยกเลิกวันหยุด"}
                </button>
              </>
            ) : (
              <>
                <label className="holiday-reason-label" htmlFor="holiday-reason">
                  เหตุผลที่ร้านหยุด (ไม่บังคับ)
                </label>

                <input
                  id="holiday-reason"
                  className="holiday-reason-input"
                  type="text"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="เช่น ร้านหยุดประจำปี"
                  maxLength={200}
                />

                <button
                  type="button"
                  className="holiday-action-button"
                  onClick={addHoliday}
                  disabled={holidayLoading}
                >
                  {holidayLoading
                    ? "กำลังบันทึก..."
                    : "ตั้งวันที่นี้เป็นวันหยุด"}
                </button>
              </>
            )}

            {message && (
              <p className="holiday-message">{message}</p>
            )}

            {error && (
              <p className="holiday-error">{error}</p>
            )}
          </div>

          <h3 className="daily-appointments-title">รายการจอง</h3>

          {loading ? (
            <p className="calendar-empty">กำลังโหลดข้อมูล...</p>
          ) : selectedBookings.length === 0 ? (
            <p className="calendar-empty">
              วันนี้ยังไม่มีรายการจอง
            </p>
          ) : (
            <div className="appointment-list">
              {selectedBookings.map((booking) => {
                const date = new Date(booking.date);

                return (
                  <article
                    className="appointment-card"
                    key={booking.id}
                  >
                    <div className="appointment-time">
                      {date.toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    <div className="appointment-info">
                      <h3>{booking.customer.name}</h3>
                      <p>{booking.service.name}</p>
                      <p>{booking.service.duration} นาที</p>

                      {booking.customer.phone && (
                        <p>{booking.customer.phone}</p>
                      )}
                    </div>

                    <span
                      className={`appointment-status ${booking.status.toLowerCase()}`}
                    >
                      {statusLabels[booking.status] || booking.status}
                    </span>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}