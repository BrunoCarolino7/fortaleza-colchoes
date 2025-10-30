import { Suspense } from "react"
import NotFoundClient from "@/components/not-found-client"

export default function NotFound() {
  return (
    <Suspense fallback={<div className="text-center p-8">Carregando...</div>}>
      <NotFoundClient />
    </Suspense>
  )
}
