"use client"

import { useSearchParams } from "next/navigation"

export default function NotFoundClient() {
  const searchParams = useSearchParams()
  const from = searchParams.get("from")

  return (
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold mb-2">Página não encontrada</h1>
      <p className="text-muted-foreground">A página que você procurou não existe.</p>
      {from && <p className="mt-2 text-sm text-muted-foreground">Origem: {from}</p>}
    </div>
  )
}
