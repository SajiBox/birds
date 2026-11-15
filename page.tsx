"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [health, setHealth] = useState<any>(null);
  const [keys, setKeys] = useState<any[]>([]);
  
  useEffect(() => {
    fetch("/api/health").then(r => r.json()).then(setHealth);
    fetch("/api/keys").then(r => r.json()).then(setKeys);
  }, []);

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">🎨 MCP Media Generator</h1>
      
      {/* قسم الصحة */}
      <div className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">حالة النظام</h2>
        <p>{health?.database === "turso-connected" ? "✅ قاعدة البيانات متصلة" : "❌ غير متصل"}</p>
      </div>

      {/* قسم المفاتيح */}
      <div className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">🔑 إدارة المفاتيح</h2>
        <ul>
          {keys.map(k => (
            <li key={k.id} className="border-b py-2 flex justify-between">
              <span>{k.provider} - {k.api_key}</span>
              <span className={`px-2 rounded ${k.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>{k.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}