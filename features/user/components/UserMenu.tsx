"use client";

import { useUser } from "@/shared/user/UserContext";

export default function UserMenu() {
  const { user, signOut } = useUser();

  function handleSignOut() {
    if (confirm("이름 변경 시 현재 화면에서 로그아웃됩니다. 진행할까요?")) {
      signOut();
    }
  }

  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-border bg-panel text-xs">
      <span className="text-muted">사용자</span>
      <span className="font-semibold">{user.name}</span>
      <button
        onClick={handleSignOut}
        className="text-muted hover:text-white border-l border-border pl-2 ml-1"
        title="이름 변경"
      >
        변경
      </button>
    </div>
  );
}
