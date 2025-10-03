interface Cliente {
    id: number
    nome?: string | null
    filiacao?: string | null
    dataNascimento?: string | null
    estadoCivil?: string | null
    nacionalidade?: string | null
    naturalidade?: string | null
    email?: string | null
    telefone?: string | null
    documento?: {
        cpf?: string | null
        rg?: string | null
    } | null
    dadosProfissionais?: {
        empresa?: string | null
        telefone?: string | null
        profissao?: string | null
        salario?: number | null
        enderecoEmpresa?: {
            logradouro?: string | null
            bairro?: string | null
            cidade?: string | null
            estado?: string | null
            cep?: string | null
            numero?: string | null
        } | null
    } | null
    conjuge?: {
        nome?: string | null
        dataNascimento?: string | null
        naturalidade?: string | null
        localDeTrabalho?: string | null
        documento?: {
            cpf?: string | null
            rg?: string | null
        } | null
    } | null
    pagamento?: {
        valorTotal?: number | null
        sinal?: number | null
        dataInicio?: string | null
        numeroParcelas?: number | null
        aReceber?: number | null
        totalPago?: number | null
        totalCancelado?: number | null
    } | null
    assinatura?: {
        assinaturaCliente?: string | null
    } | null
    enderecos?: {
        logradouro?: string | null
        bairro?: string | null
        cidade?: string | null
        estado?: string | null
        cep?: string | null
        numero?: string | null
    }[] | null
    referencias?: {
        nome?: string | null
        telefone?: string | null
    }[] | null
}
