## Contas a Receber

# Buscar contas a receber com filtro

endpoint: 
GET /account-receivable?page=1&startDate=2025-08-01&endDate=2025-08-08&overallStatus=PAID&orderBy=description

// Vi que foi feito uma lógica para buscar do banco as contas com as parcelas e filtrar depois por overallStatus, mas tem um problema nisso
// Se há 30 contas no banco, você puxa apenas 20 por vez (quantidade de itens por página) e depois sobre essas 20 você filtra pelo overallStatus,
// aquelas 10 contas que não foram puxadas no banco nunca serão filtradas. Para resolver isso o filtro por overallStatus precisa ser feito no próprio
// Prisma, e não em um código JS separado, algo mais ou menos assim

// OverallStatus == PAID
const accounts = await prisma.accountReceivable.findMany({
    where: {
        accountReceivableInstallments: {
            every: {
                status: 'PAID',
            },
        },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
});

// OverallStatus == PENDING
const accounts = await prisma.accountReceivable.findMany({
    where: {
        accountReceivableInstallments: {
            some: {
                status: 'PENDING',
            },
        },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
});

payload:
{
    total: 2,
    data: [
        {
            id: 1,
            description: "Conta a receber 1",
            receivedFrom: "Cliente A",
            totalValue: "10000",
            overallStatus: "PENDING",
            installmentsNumber: 12, // Total de parcelas
            vehicleSaleId: 1 // ID da tabela VehicleSale
        },
        {
            id: 2,
            description: "Conta a receber 2",
            receivedFrom: "Cliente B",
            totalValue: "5000",
            overallStatus: "PENDING",
            vehicleId: 1
        },
    ],
}

# Buscar parcelas de uma conta a receber

endpoint: 
GET /account-receivable-installments/${accountReceivableId}

payload:
[
    {
        id: 1,
        dueDate: "2025-01-01",
        installmentSequence: 0,
        status: "PAID",
        value: "10000",
        isRefund: false,
        isUpfront: true,
        // Remover vehicleSaleId,
        "paymentMethodReceivables": [
            {
                "id": 86,
                "paymentDate": "2020-11-18",
                "type": "CASH"
            }
        ]
    },
    {
        id: 2,
        dueDate: "2025-01-01",
        installmentSequence: 1,
        status: "PAID",
        value: "10000",
        isRefund: false,
        isUpfront: false,
        "paymentMethodReceivables": [
            {
                "id": 85,
                "paymentDate": "2020-11-18",
                "type": "CASH"
            }
        ]
    },
]

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