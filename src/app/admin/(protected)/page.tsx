"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    price: number;
    duration: number;
  };
};

type DashboardData = {
  stats: {
    totalBookings: number;
    pendingBookings: number;
    totalCustomers: number;
    activeServices: number;
    todayBookings: number;
  };
  recentBookings: Booking[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard");
        }

        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
  console.log("DASHBOARD LOADING FINISHED");
  setLoading(false);
}
    };

    loadDashboard();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>

      
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">
              HENRYNAIL / ADMIN
            </span>

            <h1>Dashboard</h1>

            <p>
              Overview of your salon activity.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="admin-panel">
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                ...
              </div>

              <h3>Loading dashboard</h3>

              <p>
                Loading data from database...
              </p>
            </div>
          </div>
        ) : data ? (
          <>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span>TOTAL BOOKINGS</span>

                <strong>
                  {data.stats.totalBookings}
                </strong>

                <small>
                  All appointments
                </small>
              </div>

              <div className="admin-stat-card">
                <span>PENDING</span>

                <strong>
                  {data.stats.pendingBookings}
                </strong>

                <small>
                  Waiting for confirmation
                </small>
              </div>

              <div className="admin-stat-card">
                <span>CUSTOMERS</span>

                <strong>
                  {data.stats.totalCustomers}
                </strong>

                <small>
                  Registered customers
                </small>
              </div>

              <div className="admin-stat-card">
                <span>ACTIVE SERVICES</span>

                <strong>
                  {data.stats.activeServices}
                </strong>

                <small>
                  Available services
                </small>
              </div>
            </div>

            <div className="admin-dashboard-grid">
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <span className="admin-panel-eyebrow">
                      TODAY
                    </span>

                    <h2>
                      Today&apos;s Bookings
                    </h2>
                  </div>

                  <div className="admin-today-count">
                    {data.stats.todayBookings}
                  </div>
                </div>

                {data.stats.todayBookings === 0 ? (
                  <div className="admin-dashboard-empty">
                    <div>○</div>

                    <p>
                      No bookings scheduled for today.
                    </p>
                  </div>
                ) : (
                  <div className="admin-dashboard-today">
                    {data.recentBookings
                      .filter((booking) => {
                        const bookingDate =
                          new Date(booking.date);

                        const today =
                          new Date();

                        return (
                          bookingDate.toDateString() ===
                          today.toDateString()
                        );
                      })
                      .map((booking) => (
                        <div
                          key={booking.id}
                          className="admin-dashboard-booking"
                        >
                          <div>
                            <strong>
                              {booking.customer.name}
                            </strong>

                            <span>
                              {booking.service.name}
                            </span>
                          </div>

                          <span>
                            {formatTime(
                              booking.date
                            )}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <span className="admin-panel-eyebrow">
                      ACTIVITY
                    </span>

                    <h2>
                      Recent Bookings
                    </h2>
                  </div>

                  <Link
                    href="/admin/bookings"
                    className="admin-panel-link"
                  >
                    VIEW ALL →
                  </Link>
                </div>

                {data.recentBookings.length === 0 ? (
                  <div className="admin-dashboard-empty">
                    <div>○</div>

                    <p>
                      No bookings yet.
                    </p>
                  </div>
                ) : (
                  <div className="admin-recent-list">
                    {data.recentBookings.map(
                      (booking) => (
                        <div
                          key={booking.id}
                          className="admin-recent-booking"
                        >
                          <div className="admin-recent-avatar">
                            {booking.customer.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="admin-recent-info">
                            <strong>
                              {booking.customer.name}
                            </strong>

                            <span>
                              {booking.service.name}
                            </span>
                          </div>

                          <div className="admin-recent-date">
                            <strong>
                              {formatDate(
                                booking.date
                              )}
                            </strong>

                            <span>
                              {formatTime(
                                booking.date
                              )}
                            </span>
                          </div>

                          <span
                            className={`admin-booking-status status-${booking.status.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="admin-panel">
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                !
              </div>

              <h3>
                Unable to load dashboard
              </h3>

              <p>
                Please check the database connection
                and try again.
              </p>
            </div>
          </div>
        )}
      
    </>
  );
}
