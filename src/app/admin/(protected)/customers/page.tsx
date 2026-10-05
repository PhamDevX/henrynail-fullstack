
"use client";

import { useEffect, useMemo, useState } from "react";

type CustomerBooking = {
  id: number;
  date: string;
  status: string;
  service: {
    name: string;
  };
};

type Customer = {
  id: number;
  name: string;
  phone: string | null;
  instagram: string | null;
  bookings: CustomerBooking[];
};

type CustomerFilter = "all" | "returning" | "new";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CustomerFilter>("all");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await fetch("/api/customers");

        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }

        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        console.error("Failed to load customers:", err);
        setError("ไม่สามารถโหลดข้อมูลลูกค้าได้");
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  const customerStats = useMemo(() => {
    return customers.reduce(
      (stats, customer) => {
        const completedCount = customer.bookings.filter(
          (booking) => booking.status === "COMPLETED"
        ).length;

        if (completedCount > 0) {
          stats.returning += 1;
        } else {
          stats.new += 1;
        }

        return stats;
      },
      { returning: 0, new: 0 }
    );
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch = [
        customer.name,
        customer.phone || "",
        customer.instagram || "",
      ].some((value) => value.toLowerCase().includes(keyword));

      const completedCount = customer.bookings.filter(
        (booking) => booking.status === "COMPLETED"
      ).length;

      const matchesFilter =
        filter === "all" ||
        (filter === "returning" && completedCount > 0) ||
        (filter === "new" && completedCount === 0);

      return matchesSearch && matchesFilter;
    });
  }, [customers, search, filter]);

  return (
    <div>
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">HENRYNAIL / ADMIN</span>
          <h1>Customers</h1>
          <p>Customer directory and service history.</p>
        </div>
      </header>

      <div className="customer-summary-grid">
        <div className="customer-summary-card">
          <span>TOTAL CUSTOMERS</span>
          <strong>{customers.length}</strong>
          <p>ลูกค้าทั้งหมด</p>
        </div>

        <div className="customer-summary-card">
          <span>RETURNING CUSTOMERS</span>
          <strong>{customerStats.returning}</strong>
          <p>เคยใช้บริการสำเร็จแล้ว</p>
        </div>

        <div className="customer-summary-card">
          <span>NEW / NOT COMPLETED</span>
          <strong>{customerStats.new}</strong>
          <p>ยังไม่มีประวัติบริการที่เสร็จสิ้น</p>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="admin-panel-eyebrow">
              CUSTOMER DATABASE
            </span>
            <h2>All Customers</h2>
          </div>

          <span className="admin-service-count">
            {filteredCustomers.length} CUSTOMERS
          </span>
        </div>

        <div className="customer-toolbar">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ค้นหาชื่อ เบอร์โทร หรือ Instagram..."
            aria-label="ค้นหาลูกค้า"
          />

          <div className="customer-filters">
            <button
              type="button"
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              ทั้งหมด
            </button>

            <button
              type="button"
              className={filter === "returning" ? "active" : ""}
              onClick={() => setFilter("returning")}
            >
              เคยใช้บริการ
            </button>

            <button
              type="button"
              className={filter === "new" ? "active" : ""}
              onClick={() => setFilter("new")}
            >
              ลูกค้าใหม่
            </button>
          </div>
        </div>

        {loading ? (
          <div className="admin-empty-state">
            <h3>Loading customers...</h3>
            <p>Please wait.</p>
          </div>
        ) : error ? (
          <div className="admin-empty-state">
            <h3>Unable to load customers</h3>
            <p>{error}</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="admin-empty-state">
            <h3>
              {search || filter !== "all"
                ? "No matching customers"
                : "No customers yet"}
            </h3>
            <p>
              {search || filter !== "all"
                ? "ลองเปลี่ยนคำค้นหาหรือตัวกรอง"
                : "ข้อมูลลูกค้าจะแสดงที่นี่เมื่อมีการจอง"}
            </p>
          </div>
        ) : (
          <div className="admin-customers-list">
            {filteredCustomers.map((customer) => {
              const bookings = customer.bookings || [];

              const completedBookings = bookings.filter(
                (booking) => booking.status === "COMPLETED"
              );

              const latestCompleted = completedBookings[0];
              const completedCount = completedBookings.length;

              return (
                <div
                  key={customer.id}
                  className="admin-customer-card"
                >
                  <div className="admin-customer-main">
                    <div className="admin-customer-avatar">
                      {customer.name?.charAt(0).toUpperCase() || "?"}
                    </div>

                    <div className="admin-customer-info">
                      <span className="admin-booking-label">
                        CUSTOMER
                      </span>
                      <h3>{customer.name}</h3>

                      <div className="admin-customer-contact">
                        <span>{customer.phone || "No phone"}</span>

                        {customer.instagram && (
                          <span>
                            @{customer.instagram.replace(/^@/, "")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="admin-customer-bookings">
                    <span>ALL BOOKINGS</span>
                    <strong>{bookings.length}</strong>
                    <small>การจองทั้งหมด</small>
                  </div>

                  <div className="admin-customer-bookings">
                    <span>COMPLETED</span>
                    <strong>{completedCount}</strong>
                    <small>บริการที่เสร็จแล้ว</small>
                  </div>

                  <div className="admin-customer-last">
                    <span>LAST VISIT</span>
                    <strong>
                      {latestCompleted
                        ? formatDate(latestCompleted.date)
                        : "-"}
                    </strong>
                    <small>วันที่ใช้บริการสำเร็จล่าสุด</small>
                  </div>

                  <div className="admin-customer-status">
                    {completedCount > 0 ? (
                      <span className="admin-customer-active">
                        RETURNING
                      </span>
                    ) : (
                      <span className="admin-customer-new">
                        NEW
                      </span>
                    )}
                  </div>

                  {bookings.length > 0 && (
                    <details className="customer-history">
                      <summary>ดูประวัติการจอง ({bookings.length})</summary>

                      <div className="customer-history-list">
                        {bookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="customer-history-item"
                          >
                            <div>
                              <strong>{booking.service.name}</strong>
                              <span>{formatDate(booking.date)}</span>
                            </div>

                            <span
                              className={`admin-booking-status status-${booking.status.toLowerCase()}`}
                            >
                              {booking.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .customer-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        .customer-summary-card {
          min-width: 0;
          padding: 20px;
          border: 1px solid #e8e5dc;
          border-radius: 14px;
          background: #fff;
        }

        .customer-summary-card > span,
        .customer-summary-card p {
          display: block;
          color: #777f78;
          font-size: 11px;
        }

        .customer-summary-card strong {
          display: block;
          margin: 12px 0 6px;
          color: #193d32;
          font-size: 30px;
          font-weight: 600;
        }

        .customer-summary-card p {
          margin: 0;
        }

        .customer-toolbar {
          display: grid;
          gap: 12px;
          margin: 20px 0;
        }

        .customer-toolbar input {
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

        .customer-toolbar input:focus {
          outline: 2px solid rgba(25, 61, 50, 0.15);
          border-color: #193d32;
        }

        .customer-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .customer-filters button {
          padding: 9px 12px;
          border: 1px solid #e5e1d8;
          border-radius: 8px;
          background: #fff;
          color: #5e665f;
          font-size: 12px;
          cursor: pointer;
        }

        .customer-filters button.active {
          border-color: #193d32;
          background: #193d32;
          color: #fff;
        }

        .admin-customer-card {
          min-width: 0;
        }

        .admin-customer-info,
        .admin-customer-contact {
          min-width: 0;
        }

        .admin-customer-contact span {
          overflow-wrap: anywhere;
        }

        .admin-customer-bookings small,
        .admin-customer-last small {
          display: block;
          margin-top: 5px;
          color: #858b84;
          font-size: 10px;
        }

        .customer-history {
          grid-column: 1 / -1;
          min-width: 0;
          margin-top: 8px;
          padding-top: 12px;
          border-top: 1px solid #e8e5dc;
        }

        .customer-history summary {
          color: #193d32;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .customer-history-list {
          display: grid;
          gap: 10px;
          margin-top: 12px;
        }

        .customer-history-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px;
          border-radius: 9px;
          background: #f8f7f3;
        }

        .customer-history-item > div {
          display: grid;
          gap: 4px;
          min-width: 0;
        }

        .customer-history-item strong {
          color: #193d32;
          font-size: 12px;
          overflow-wrap: anywhere;
        }

        .customer-history-item > div span {
          color: #777f78;
          font-size: 11px;
        }

        @media (max-width: 768px) {
          .customer-summary-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .customer-summary-card {
            padding: 16px;
          }

          .customer-summary-card strong {
            margin-top: 8px;
            font-size: 26px;
          }

          .customer-history-item {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}