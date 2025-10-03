export function ErrorState({ loading, status, message, }: {
    loading?: boolean, status?: number, message: string
}) {
    if (loading) return null
    if (!status) return null // 🚀 não renderiza nada até ter status

    let title: string
    let description: string
    let image: string

    if (status === 404) {
        title = "Nada por aqui..."
        description = "Nenhum cliente foi encontrado."
        image = "https://cdn-icons-png.flaticon.com/512/748/748122.png"
    } else if (status === 500) {
        title = "Erro interno"
        description = "Algo deu errado no servidor. Tente novamente mais tarde."
        image = "https://cdn-icons-png.flaticon.com/512/564/564619.png"
    } else {
        title = "Ocorreu um erro"
        description = message || "Tente novamente em alguns instantes."
        image = "https://cdn-icons-png.flaticon.com/512/564/564619.png"
    }

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <img src={image} alt="Error illustration" className="w-32 h-32 mb-4 opacity-80" />
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <p className="text-gray-500 mt-2">{description}</p>
        </div>
    )
}
