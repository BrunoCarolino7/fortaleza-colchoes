import EstoqueContent from "./estoqueContent"
export const dynamic = "force-dynamic"

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default async function EstoquePage() {
  return <EstoqueContent  />
}
