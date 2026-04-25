"use client";

import { useState, type ReactNode } from "react";

export default function AddSymbolForm({
  onAdd,
  right,
}: {
  onAdd: (symbol: string) => void;
  right?: ReactNode;
}) {
  const [input, setInput] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    onAdd(input);
    setInput("");
  }

  return (
    <form onSubmit={submit} className="flex gap-2 items-center">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="종목 추가 (예: AAPL)"
        className="flex-1 sm:max-w-xs bg-panel border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-muted"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-panel2 border border-border rounded-lg text-sm hover:bg-border"
      >
        추가
      </button>
      {right && <div className="ml-auto">{right}</div>}
    </form>
  );
}
