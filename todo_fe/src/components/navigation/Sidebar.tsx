import Link from "next/link"

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background p-4">
      <div className="mb-6 font-semibold text-lg">
        Todo App
      </div>

      <nav className="space-y-2 text-sm">
        <Link
          href="/workspaces"
          className="block rounded px-3 py-2 hover:bg-muted"
        >
          Workspaces
        </Link>
      </nav>
    </aside>
  )
}