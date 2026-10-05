
"use client";

import { useEffect, useMemo, useState } from "react";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

type Booking = {
  id: number;
  date: string;
  status: string;
  note: string | null;
  customer: {
    name: string;
    phone: string | null;
    instagram: string | null;
  };
  service: {
    name: string;
    duration: number;
    price: number;
  };
};

type BookingTab = "upcoming" | "completed" | "cancelled" | "all";

const tabs: { id: BookingTab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "all", label: "All History" },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming");
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  async function loadBookings() {
    try {
      const response = await fetch("/api/bookings");

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function updateBookingStatus(
    id: number,
    status: BookingStatus
  ) {
    if (updatingId !== null) return;

    setUpdatingId(id);

    try {
      const response = await fetch("/api/bookings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Failed to update booking");
      }

      const updatedBooking: Booking = await response.json();

      setBookings((current) =>
        current.map((booking) =>
          booking.id === updatedBooking.id
            ? { ...booking, ...updatedBooking }
            : booking
        )
      );
    } catch (error) {
      console.error("Failed to update booking:", error);
      alert(
        error instanceof Error
          ? `เปลี่ยนสถานะไม่สำเร็จ: ${error.message}`
          : "ไม่สามารถเปลี่ยนสถานะการจองได้"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const counts = useMemo(
    () => ({
      upcoming: bookings.filter(
        (b) => b.status === "PENDING" || b.status === "CONFIRMED"
      ).length,
      completed: bookings.filter((b) => b.status === "COMPLETED").length,
      cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
      all: bookings.length,
    }),
    [bookings]
  );

  const filteredBookings = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return bookings
      .filter((booking) => {
        if (activeTab === "upcoming") {
          return (
            booking.status === "PENDING" ||
            booking.status === "CONFIRMED"
          );
        }

        if (activeTab === "completed") {
          return booking.status === "COMPLETED";
        }

        if (activeTab === "cancelled") {
          return booking.status === "CANCELLED";
        }

        return true;
      })
      .filter((booking) => {
  const date = new Date(booking.date);

  const matchesMonth =
    selectedMonth === "all" ||
    date.getMonth() + 1 === Number(selectedMonth);

  const matchesYear =
    selectedYear === "all" ||
    date.getFullYear() === Number(selectedYear);

  const matchesSearch =
    !keyword ||
    [
      booking.customer.name,
      booking.customer.phone || "",
      booking.customer.instagram || "",
      booking.service.name,
      booking.status,
    ].some((value) => value.toLowerCase().includes(keyword));

  return matchesMonth && matchesYear && matchesSearch;
})
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [bookings, activeTab, search, selectedMonth, selectedYear]);

  return (
    <div>
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">HENRYNAIL / ADMIN</span>
          <h1>Bookings</h1>
          <p>Manage appointments and booking history.</p>
        </div>
      </header>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="admin-panel-eyebrow">APPOINTMENTS</span>
            <h2>Booking Management</h2>
          </div>
        </div>

        <div className="booking-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`booking-tab ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="booking-tab-count">{counts[tab.id]}</span>
            </button>
          ))}
        </div>

        <div className="booking-search">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ค้นหาชื่อลูกค้า เบอร์โทร หรือบริการ..."
            aria-label="ค้นหาประวัติการจอง"
          />
        </div>
        
<div className="booking-date-filters">
  <select
    value={selectedMonth}
    onChange={(event) => setSelectedMonth(event.target.value)}
    aria-label="เลือกเดือน"
  >
    <option value="all">ทุกเดือน</option>
    {Array.from({ length: 12 }, (_, index) => (
      <option key={index + 1} value={String(index + 1)}>
        {new Date(2000, index, 1).toLocaleDateString("th-TH", {
          month: "long",
        })}
      </option>
    ))}
  </select>

  <select
    value={selectedYear}
    onChange={(event) => setSelectedYear(event.target.value)}
    aria-label="เลือกปี"
  >
    <option value="all">ทุกปี</option>
    {[...new Set(bookings.map((booking) =>
      new Date(booking.date).getFullYear()
    ))]
      .sort((a, b) => b - a)
      .map((year) => (
        <option key={year} value={String(year)}>
          {year + 543}
        </option>
      ))}
  </select>

  {(selectedMonth !== "all" || selectedYear !== "all") && (
    <button
      type="button"
      onClick={() => {
        setSelectedMonth("all");
        setSelectedYear("all");
      }}
    >
      ล้างตัวกรอง
    </button>
  )}
</div>

        {loading ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">...</div>
            <h3>Loading bookings</h3>
            <p>Loading booking data...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">
              {activeTab === "upcoming" ? "✓" : "—"}
            </div>
            <h3>
              {search
                ? "No matching bookings"
                : activeTab === "upcoming"
                  ? "No upcoming bookings"
                  : activeTab === "completed"
                    ? "No completed bookings"
                    : activeTab === "cancelled"
                      ? "No cancelled bookings"
                      : "No bookings yet"}
            </h3>
            <p>
              {search
                ? "ลองเปลี่ยนคำค้นหาอีกครั้ง"
                : activeTab === "upcoming"
                  ? "ตอนนี้ไม่มีคิวที่รอดำเนินการหรือยืนยันแล้ว"
                  : "รายการจองจะแสดงที่นี่เมื่อมีข้อมูล"}
            </p>
          </div>
        ) : (
          <div className="admin-bookings-list">
            {filteredBookings.map((booking) => {
              const date = new Date(booking.date);
              const isUpdating = updatingId === booking.id;

              return (
                <div key={booking.id} className="admin-booking-card">
                  <div className="admin-booking-main">
                    <div>
                      <span className="admin-booking-label">CUSTOMER</span>
                      <h3>{booking.customer.name}</h3>
                      <p>{booking.customer.phone || "No phone"}</p>
                      {booking.customer.instagram && (
                        <p>{booking.customer.instagram}</p>
                      )}
                    </div>

                    <div>
                      <span className="admin-booking-label">SERVICE</span>
                      <h3>{booking.service.name}</h3>
                      <p>{booking.service.duration} MIN</p>
                      <p>
                        {Number(booking.service.price).toLocaleString("th-TH")}{" "}
                        บาท
                      </p>
                    </div>

                    <div>
                      <span className="admin-booking-label">DATE &amp; TIME</span>
                      <h3>{date.toLocaleDateString("th-TH")}</h3>
                      <p>
                        {date.toLocaleTimeString("th-TH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        น.
                      </p>
                    </div>

                    <div>
                      <span className="admin-booking-label">STATUS</span>

                      <div className="admin-booking-actions">
                        <div
                          className={`admin-booking-status status-${booking.status.toLowerCase()}`}
                        >
                          {booking.status}
                        </div>

                        {booking.note && (
                          <p className="booking-note">
                            หมายเหตุ: {booking.note}
                          </p>
                        )}

                        {booking.status === "PENDING" && (
                          <div className="admin-booking-buttons">
                            <button
                              type="button"
                              className="admin-booking-confirm"
                              disabled={isUpdating}
                              onClick={() =>
                                updateBookingStatus(booking.id, "CONFIRMED")
                              }
                            >
                              {isUpdating ? "กำลังบันทึก..." : "ยืนยัน"}
                            </button>

                            <button
                              type="button"
                              className="admin-booking-cancel"
                              disabled={isUpdating}
                              onClick={() => {
                                if (
                                  window.confirm("ต้องการยกเลิกคิวนี้หรือไม่?")
                                ) {
                                  updateBookingStatus(
                                    booking.id,
                                    "CANCELLED"
                                  );
                                }
                              }}
                            >
                              ยกเลิก
                            </button>
                          </div>
                        )}

                        {booking.status === "CONFIRMED" && (
                          <div className="admin-booking-buttons">
                            <button
                              type="button"
                              className="admin-booking-confirm"
                              disabled={isUpdating}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "ยืนยันว่าลูกค้าได้รับบริการเสร็จแล้วใช่ไหม?"
                                  )
                                ) {
                                  updateBookingStatus(
                                    booking.id,
                                    "COMPLETED"
                                  );
                                }
                              }}
                            >
                              {isUpdating ? "กำลังบันทึก..." : "✓ เสร็จสิ้น"}
                            </button>

                            <button
                              type="button"
                              className="admin-booking-cancel"
                              disabled={isUpdating}
                              onClick={() => {
                                if (
                                  window.confirm("ต้องการยกเลิกคิวนี้หรือไม่?")
                                ) {
                                  updateBookingStatus(
                                    booking.id,
                                    "CANCELLED"
                                  );
                                }
                              }}
                            >
                              ยกเลิกคิว
                            </button>
                          </div>
                        )}

                        {booking.status === "CANCELLED" && (
                          <div className="admin-booking-buttons">
                            <button
                              type="button"
                              className="admin-booking-confirm"
                              disabled={isUpdating}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "ต้องการยืนยันคิวนี้อีกครั้งหรือไม่?"
                                  )
                                ) {
                                  updateBookingStatus(
                                    booking.id,
                                    "CONFIRMED"
                                  );
                                }
                              }}
                            >
                              ยืนยันอีกครั้ง
                            </button>
                          </div>
                        )}

                        {booking.status === "COMPLETED" && (
                          <p className="booking-completed-note">
                            ✓ ให้บริการเสร็จแล้ว
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .booking-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 20px 0;
          border-bottom: 1px solid #e8e5dc;
          padding-bottom: 12px;
        }

        .booking-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 13px;
          border: 1px solid #e5e1d8;
          border-radius: 9px;
          background: #fff;
          color: #5e665f;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .booking-tab.active {
          border-color: #193d32;
          background: #193d32;
          color: #fff;
        }

        .booking-tab-count {
          display: inline-flex;
          min-width: 21px;
          height: 21px;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: #f0eee8;
          color: #193d32;
          font-size: 10px;
        }

        .booking-tab.active .booking-tab-count {
          background: #fff;
        }

        .booking-search {
          margin: 0 0 20px;
        }

        .booking-search input {
          box-sizing: border-box;
          width: 100%;
          min-height: 44px;
          padding: 11px 14px;
          border: 1px solid #e5e1d8;
          border-radius: 9px;
          background: #fff;
          color: #193d32;
          font: inherit;
          font-size: 13px;
        }

        .booking-search input:focus {
          outline: 2px solid rgba(25, 61, 50, 0.15);
          border-color: #193d32;
        }

        .booking-note,
        .booking-completed-note {
          margin: 10px 0 0;
          color: #66736b;
          font-size: 12px;
          overflow-wrap: anywhere;
        }

        .booking-completed-note {
          color: #36856a;
          font-weight: 600;
        }

        .admin-booking-buttons button:disabled {
          opacity: 0.55;
          cursor: wait;
        }

        @media (max-width: 480px) {
          .booking-tabs {
            gap: 6px;
          }

          .booking-tab {
            padding: 9px 10px;
            font-size: 11px;
          }
        }
          .booking-date-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 0 0 20px;
          } 

          .booking-date-filters select,
          .booking-date-filters button {
           min-height: 42px;
           padding: 9px 12px;
           border: 1px solid #e5e1d8;
           border-radius: 9px;
           background: #fff;
           color: #193d32;
            font-size: 12px;
}

             .booking-date-filters button {
              cursor: pointer;
}

               @media (max-width: 480px) {
              .booking-date-filters select {
               flex: 1;
              min-width: 0;
               }
}
      `}</style>
    </div>
  );
}