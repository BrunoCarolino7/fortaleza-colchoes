import { produtosIniciais } from "@/lib/data/estoque"
import EstoqueContent from "./estoqueContent"
export const dynamic = "force-dynamic"

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default async function EstoquePage() {

  await delay(2000)

  // quando o delay acabar, o Next substitui o loading.tsx por isso
  return <EstoqueContent produtosIniciais={produtosIniciais} />
}
