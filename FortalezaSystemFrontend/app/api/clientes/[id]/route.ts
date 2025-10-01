import { NextResponse } from "next/server"
import { clientesIniciais, type Cliente } from "@/lib/data/clientes"

// Simulando um banco de dados em memória
const clientes: Cliente[] = [...clientesIniciais]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const cliente = clientes.find((c) => c.id === params.id)

  if (!cliente) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
  }

  return NextResponse.json(cliente)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const index = clientes.findIndex((c) => c.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
    }

    clientes[index] = {
      ...body,
      id: params.id,
      dataCadastro: clientes[index].dataCadastro,
    }

    return NextResponse.json(clientes[index])
  } catch (error) {
    console.error("[v0] Erro ao atualizar cliente:", error)
    return NextResponse.json({ error: "Erro ao atualizar cliente" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = clientes.findIndex((c) => c.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
  }

  clientes.splice(index, 1)

  return NextResponse.json({ success: true })
}
