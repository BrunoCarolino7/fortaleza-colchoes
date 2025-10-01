import { NextResponse } from "next/server"
import { clientesIniciais, type Cliente } from "@/lib/data/clientes"

// Simulando um banco de dados em memória
const clientes: Cliente[] = [...clientesIniciais]

export async function GET() {
  return NextResponse.json(clientes)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Gerar ID único
    const novoCliente: Cliente = {
      ...body,
      id: Date.now().toString(),
      dataCadastro: new Date().toISOString().split("T")[0],
    }

    clientes.push(novoCliente)

    return NextResponse.json(novoCliente, { status: 201 })
  } catch (error) {
    console.error("[v0] Erro ao criar cliente:", error)
    return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 })
  }
}
