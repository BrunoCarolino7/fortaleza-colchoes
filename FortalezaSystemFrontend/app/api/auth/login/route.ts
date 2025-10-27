import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { User, Password } = body

    // In production, this would validate against a database
    if (User && Password) {
      // For demo purposes, accept any non-empty credentials
      // You can add specific validation here like:
      // if (User === "admin@example.com" && Password === "admin123")

      // Generate a simple token (in production, use JWT)
      const token = Buffer.from(`${User}:${Date.now()}`).toString("base64")

      return NextResponse.json(
        {
          success: true,
          token,
          user: User,
        },
        { status: 200 },
      )
    }

    return NextResponse.json({ success: false, error: "Credenciais inválidas" }, { status: 401 })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ success: false, error: "Erro no servidor" }, { status: 500 })
  }
}
