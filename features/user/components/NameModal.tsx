"use client";

import { useState } from "react";

export default function NameModal({
  loading,
  error,
  onSubmit,
}: {
  loading: boolean;
  error?: string;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || loading) return;
    onSubmit(name);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-panel border border-border p-6 flex flex-col gap-4 shadow-2xl"
      >
        <div>
          <h2 className="text-xl font-bold">Stock Dashboard</h2>
          <p className="text-sm text-muted mt-1">
            이름을 입력하세요. 같은 이름으로 다시 들어오면 이전 대시보드가
            그대로 보입니다.
          </p>
        </div>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className="bg-bg border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-muted"
        />
        {error && (
          <div className="text-xs text-down border border-down/30 bg-down/10 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="bg-panel2 border border-border rounded-md px-4 py-2 text-sm hover:bg-border disabled:opacity-50"
        >
          {loading ? "확인 중…" : "시작"}
        </button>
      </form>
    </div>
  );
}
