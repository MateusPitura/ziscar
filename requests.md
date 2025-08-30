## Contas a Receber

# Buscar contas a receber com filtro

endpoint: 
GET /account-receivable?page=1&startDate=2025-08-01&endDate=2025-08-08&overallStatus=PAID&orderBy=description

payload:
{
    total: 2, // total de itens, usado para a paginação
    data: [
        {
            id: 1,
            description: "Conta a receber 1",
            receivedFrom: "Cliente A",
            totalValue: "10000", // soma do valor das parcelas, deve vir em centavos
            overallStatus: "PENDING", // será PAID quando todas as parcelas possuírem status PAID
        },
        {
            id: 2,
            description: "Conta a receber 2",
            receivedFrom: "Cliente B",
            totalValue: "5000",
            overallStatus: "PENDING",
        },
    ],
}

# Buscar parcelas de uma conta a receber

endpoint: 
GET /account-receivable-installments/${accountReceivableId}?orderBy=dueDate

payload:
[ // aqui não precisa ser paginado pois não haverá muitas
    {
        id: 1,
        dueDate: "2025-01-01",
        installmentSequence: 0, // deve ser 0 quando isUpfront for true
        status: "PAID",
        value: "10000", // o valor deve vir em centavos
        isRefund: false, // no momento pode trazer sempre false
        isUpfront: true,
        vehicleSaleId: 1, // id da venda
    },
    {
        id: 2,
        dueDate: "2025-01-01",
        installmentSequence: 1,
        status: "PAID",
        value: "10000",
        isRefund: false,
        isUpfront: false,
        vehicleSaleId: 2
    },
    {
        id: 3,
        dueDate: "2025-02-01",
        installmentSequence: 2,
        status: "PENDING",
        value: "10000",
        isRefund: false,
        isUpfront: false,
        vehicleSaleId: 3
    },
    {
        id: 4,
        dueDate: "2025-03-01",
        installmentSequence: 3,
        status: "PENDING",
        value: "10000",
        isRefund: false,
        isUpfront: false,
        vehicleSaleId: 4
    },
]

# Buscar informações de uma conta

endpoint:
GET /account-receivable/${installmentId}

payload:
{
    id: 1,
    dueDate: "2025-01-01",
    installmentSequence: 0,
    status: "PAID",
    value: "10000",
    isRefund: false,
    isUpfront: true,
    vehicleSaleId: 1,
}

# Buscar método de pagamento de uma parcela

endpoint:
GET /accounts-receivable-installments/payment-method/${installmentId}

payload:
{ // no banco uma parcela pode ter mais de um método de pagamento, mas por simplicidade será cadastrado apenas 1, logo na busca pode trazer apenas 1 também
    id: 1,
    paymentDate: "2025-01-01",
    type: "CREDIT_CARD",
}
 
# Adicionar método de pagamento em uma parcela

endpoint:
POST /accounts-receivable-installments/payment-method/${installmentId}

payload:
{ // no banco o método de pagamento também precisa do value, como a parcela terá apenas 1 método de pagamento no momento, o value do método de pagamento pode ser igual ao value da parcela. Ao adicionar um método de pagamento o status da parcela deve passar de PENDING para PAID
    "type": "CREDIT_CARD",
    "paymentDate": "2025-08-16"
}

## Veículos

# Buscar venda do veículo

endpoint:
GET /vehicle-sale/${vehicleSaleId} // Aqui iria retornar o snapshot da venda

payload: 
{
    id: 1,
    modelName: "Fusca",
    announcedPrice: 9000000,
    plateNumber: "ABC1234",
    modelYear: 1970,
    status: "DELIVERED",
    archivedAt: undefined,
    brand: {
        id: 10,
        name: "Volkswagen",
    },
    store: {
        id: 1,
        name: "Loja 1",
    },
    category: "CAR",
    color: "#FF0000",
    chassiNumber: "AAAAAAAAAAAAAAAAA",
    commissionValue: 0,
    fuelType: "FLEX",
    kilometers: 1000,
    minimumPrice: 8000000,
    yearOfManufacture: 1970,
    characteristics: ["Direção hidráulica", "Janelas elétricas"]
}

# Buscar veículo pelo ID

endpoint:
GET /vehicle/${vehicleId}

payload: // Daria para ter apenas uma request que retorna tudo isso ou uma com tudo isso e outra só para vehicle
{
    payment: { // Detalhes do pagamento, só os dados abaixo
        purchaseDate: "2025-01-01;
        paidTo: "Fulano"; // null
    };
    vehicle: {
        id: 1,
        modelName: "Fusca",
        announcedPrice: 9000000,
        plateNumber: "ABC1234",
        modelYear: 1970,
        status: "DELIVERED",
        archivedAt: undefined,
        brand: {
            id: 10,
            name: "Volkswagen",
        },
        store: {
            id: 1,
            name: "Loja 1",
        },
        category: "CAR",
        color: "#FF0000",
        chassiNumber: "AAAAAAAAAAAAAAAAA",
        commissionValue: 0,
        fuelType: "FLEX",
        kilometers: 1000,
        minimumPrice: 8000000,
        yearOfManufacture: 1970,
        characteristics: ["Direção hidráulica", "Janelas elétricas"]
    }
}

# Listar veículos

endpoint:
GET /vehicles?page=1&startDate=2025-08-01&endDate=2025-08-08&orderBy=modelName // Adicionar ordenação

payload:
{
    total: 0,
    data: [] // Incluir archivedAt
}

# Listar gastos

endpoint:
GET /vehicle-expense/${vehicleId}

payload: // Aqui não precisa de paginação nem de filtro
{
    [
        {
            id: 1,
            category: "MAINTENANCE",
            observations: "Troca de óleo",
            archivedAt: undefined,
            totalValue: "1500",
            competencyDate: "2023-10-01",
      }
    ]
}

# Buscar gasto por ID do gasto

endpoint:
GET /vehicle-expense/${expenseId}

payload:
{
    category: "IPVA",
    competencyDate: "2025-01-01",
    id: 1,
    observations: "Seu Jorge",
    totalValue: "100000",
    archivedAt: undefined,
}

# Criar veículo

endpoint
POST /vehicles

payload:
{
    "payment": { // Faltou dados da compra, a description da conta a pagar pode ser "Compra Veículo <placa>". Se quiser pode seguir o modelo da venda
        "purchaseDate": "2000-01-01",
        "paidTo": "Leilão", // Pode ser null
        "installment": {
            "value": "5000000",
            "status": "PENDING",
            "dueDate": "2000-01-01", // Pode ser null
            "paymentDate": null, // Ex.: "2000-01-01"
            "paymentMethod": null // Ex.: "CREDIT_CARD"
        }
    },
    "vehicle": { // Alguns valores estão como string mas era para ser number, porém não deu erro para inserir
        "plateNumber": "ABC1234", // Validar por placa duplicado
        "chassiNumber": "AAAAAAAAAAAAAAAAA", // Validar por chassi duplicado
        "announcedPrice": "6000000",
        "minimumPrice": "6000000",
        "commissionValue": "100000",
        "storeId": "16",
        "kilometers": "5000",
        "modelName": "Fusca",
        "brandId": "42",
        "color": "c92424",
        "modelYear": "2026",
        "yearOfManufacture": "2025",
        "fuelType": "FLEX",
        "status": "PURCHASED",
        "category": "TRUCK"
    },
    "characteristics": ["Air bag", "Direção hidráulica"] // As características comuns e customizadas irão juntas aqui
}

# Editar veículo

endpoint:
PATCH /vehicles/${vehicleId}

payload:
{
    "characteristics": ["Ar condicionado", "Câmera de ré"], // Acho que seria mais fácil enviar todas as características sempre e não só o que mudar
    "payment": { // Faltou edição do pagamento, só os campos abaixo
        "paidTo": "Leilão", // null
        "purchaseDate": "2000-01-01"
    },
    "vehicle": { // O update só do veículo deu boa
        "kilometers": "2000",
        "plateNumber": "ABC1235", // Validar duplicado
        "announcedPrice": "9000000", // Validar duplicado
        "minimumPrice": "9000000",
        "commissionValue": "2000",
        "color": "f01212",
        "fuelType": "ELECTRIC",
        "status": "IN_STOCK",
        "chassiNumber": "AAAAAAAAAAAAAAAAA",
        "modelYear": "2026",
        "yearOfManufacture": "2025",
        "modelName": "Prisma",
        "category": "TRUCK",
        "storeId": "30",
        "brandId": "18"
    }
}

# Editar gasto do veículo

endpoint:
PATCH /vehicle-expense/${expenseId}

payload: // será editado observações, categoria e data de competência

# Criar gasto do veículo

endpoint:
POST /vehicle-expense

payload: // Ao usar a request de exemplo não deu certo. Pode remover o valor total. Adicionar competencyDate

# Desativar um gasto do veículo

endpoint:
DELETE /vehicle-expense/${vehicleId}

payload: // pode seguir o modelo do veículo
{
    archivedAt: "2025-01-01"
}

# Ativar um gasto do veículo

endpoint:
DELETE /vehicle-expense/${vehicleId}

payload:
{
    archivedAt: null
}

# Venda do veículo

Não está aceitando valor da comissão como 0