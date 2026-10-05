"use client";

import { useEffect, useState } from "react";

type SettingsForm = {
  shop_name: string;
  phone: string;
  instagram: string;
  facebook: string;
  address: string;
  description: string;
};

const defaultForm: SettingsForm = {
  shop_name: "",
  phone: "",
  instagram: "",
  facebook: "",
  address: "",
  description: "",
};

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const response = await fetch("/api/settings");

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();
      const nextForm = { ...defaultForm };

      data.forEach(
        (setting: {
          key: keyof SettingsForm;
          value: string | null;
        }) => {
          if (setting.key in nextForm) {
            nextForm[setting.key] = setting.value ?? "";
          }
        }
      );

      setForm(nextForm);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function updateField(
    field: keyof SettingsForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      for (const [key, value] of Object.entries(form)) {
        const response = await fetch("/api/settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key,
            value,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to save ${key}`);
        }
      }

      setMessage("บันทึกข้อมูลเรียบร้อยแล้ว");
    } catch (error) {
      console.error(error);
      setMessage("ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-page settings-page">
        <div className="settings-loading">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="admin-page settings-page">

      {/* HEADER */}
      <div className="settings-header">
        <div>
          <div className="settings-kicker">SYSTEM</div>
          <h1>Settings</h1>
          <p>จัดการข้อมูลพื้นฐานของ HENRYNAIL</p>
        </div>

        <button
          className="settings-save-button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "กำลังบันทึก..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className="settings-message">
          {message}
        </div>
      )}

      {/* SHOP INFORMATION */}
      <section className="settings-section">

        <div className="settings-section-header">
          <div className="settings-number">01</div>

          <div>
            <h2>ข้อมูลร้าน</h2>
            <p>ข้อมูลหลักของ HENRYNAIL</p>
          </div>
        </div>

        <div className="settings-fields two-columns">

          <div className="settings-field">
            <label>ชื่อร้าน</label>
            <input
              value={form.shop_name}
              onChange={(e) =>
                updateField("shop_name", e.target.value)
              }
              placeholder="HENRYNAIL"
            />
          </div>

          <div className="settings-field">
            <label>เบอร์โทร</label>
            <input
              value={form.phone}
              onChange={(e) =>
                updateField("phone", e.target.value)
              }
              placeholder="08X-XXX-XXXX"
            />
          </div>

          <div className="settings-field">
            <label>Instagram</label>
            <input
              value={form.instagram}
              onChange={(e) =>
                updateField("instagram", e.target.value)
              }
              placeholder="@henrynail_"
            />
          </div>

          <div className="settings-field">
            <label>Facebook</label>
            <input
              value={form.facebook}
              onChange={(e) =>
                updateField("facebook", e.target.value)
              }
              placeholder="HENRYNAIL"
            />
          </div>

        </div>
      </section>


      {/* LOCATION */}
      <section className="settings-section">

        <div className="settings-section-header">
          <div className="settings-number">02</div>

          <div>
            <h2>สถานที่</h2>
            <p>ตำแหน่งและที่อยู่ของร้าน</p>
          </div>
        </div>

        <div className="settings-fields">

          <div className="settings-field">
            <label>ที่อยู่</label>

            <textarea
              value={form.address}
              onChange={(e) =>
                updateField("address", e.target.value)
              }
              placeholder="กรอกที่อยู่ของร้าน"
              rows={5}
            />
          </div>

        </div>
      </section>


      {/* ABOUT */}
      <section className="settings-section">

        <div className="settings-section-header">
          <div className="settings-number">03</div>

          <div>
            <h2>เกี่ยวกับร้าน</h2>
            <p>คำอธิบายที่ใช้สำหรับเว็บไซต์</p>
          </div>
        </div>

        <div className="settings-fields">

          <div className="settings-field">
            <label>คำอธิบายร้าน</label>

            <textarea
              value={form.description}
              onChange={(e) =>
                updateField("description", e.target.value)
              }
              placeholder="เขียนคำอธิบายเกี่ยวกับ HENRYNAIL"
              rows={7}
            />
          </div>

        </div>
      </section>


      {/* FOOTER */}
      <div className="settings-footer">

        <div>
          <strong>ข้อมูลร้าน</strong>
          <span>การเปลี่ยนแปลงจะถูกบันทึกลงฐานข้อมูล</span>
        </div>

        <button
          className="settings-save-button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "กำลังบันทึก..." : "Save Changes"}
        </button>

      </div>

    </div>
  );
}