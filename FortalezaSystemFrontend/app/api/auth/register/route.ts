import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { User, Password } = body

    // Validate input
    if (!User || !Password) {
      return NextResponse.json({ success: false, error: "Usuário e senha são obrigatórios" }, { status: 400 })
    }

    if (Password.length < 6) {
      return NextResponse.json({ success: false, error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    // In production, this would:
    // 1. Check if user already exists in database
    // 2. Hash the password
    // 3. Store user in database
    // For demo purposes, we'll accept any registration

    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Conta criada com sucesso",
        user: User,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Registration API error:", error)
    return NextResponse.json({ success: false, error: "Erro no servidor" }, { status: 500 })
  }
}
