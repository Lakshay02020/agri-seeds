import { Loader2 } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-green-600">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium text-zinc-500">Loading data...</p>
      </div>
    </div>
  )
}
