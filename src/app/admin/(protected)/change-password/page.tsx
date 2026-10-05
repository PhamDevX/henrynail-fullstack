
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (newPassword.length < 8) {
      setMessage("รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร");
      setIsError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("รหัสผ่านใหม่ไม่ตรงกัน");
      setIsError(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
        setIsError(true);
        return;
      }

      window.location.href = "/admin";
    } catch {
      setMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ กรุณาลองอีกครั้ง");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="change-password-page">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">ACCOUNT SECURITY</span>
          <h1>เปลี่ยนรหัสผ่าน</h1>
          <p>
            เปลี่ยนรหัสผ่านสำหรับบัญชีผู้ดูแล HENRYNAIL
            เพื่อรักษาความปลอดภัยของบัญชี
          </p>
        </div>
      </header>

      <section className="admin-panel change-password-card">
        <div className="admin-panel-header">
          <div>
            <h2>Change Password</h2>
            <p>กรอกรหัสผ่านปัจจุบันและตั้งรหัสผ่านใหม่</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="admin-form-group change-password-field">
            <label htmlFor="currentPassword">รหัสผ่านปัจจุบัน</label>
            <input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
          </div>

          <div className="admin-form-group change-password-field">
            <label htmlFor="newPassword">รหัสผ่านใหม่</label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
            <small>ต้องมีอย่างน้อย 8 ตัวอักษร</small>
          </div>

          <div className="admin-form-group change-password-field">
            <label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          {message && (
            <p
              role="status"
              className={`change-password-message ${
                isError ? "error" : "success"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="admin-primary-button change-password-submit"
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
          </button>
        </form>

        <Link href="/admin" className="change-password-back">
          ← กลับหน้า Dashboard
        </Link>
      </section>
    </div>
  );
}