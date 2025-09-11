## Contas a Pagar

# Buscar contas a pagar com filtro

endpoint: 
GET /account-payable?page=1&startDate=2025-08-01&endDate=2025-08-08&overallStatus=PAID&orderBy=description

payload:
{
    total: 2,
    data: [
        {
            id: 1,
            description: "Conta a pagar 1",
            paidTo: "Cliente A",
            totalValue: "10000",
            overallStatus: "PENDING",
        },
        {
            id: 2,
            description: "Conta a pagar 2",
            paidTo: "Cliente B",
            totalValue: "5000",
            overallStatus: "PENDING",
        },
    ],
}

# Buscar parcelas de uma conta a pagar

endpoint: 
GET /account-payable-installments/${accountPayableId} // Ordenar por installmentSequence

payload:
[
    {
        id: 1,
        dueDate: "2025-01-01",
        installmentSequence: 0,
        status: "PAID",
        value: "10000",
        isRefund: false
        isUpfront: true,
        "paymentMethodPayables": [
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
        "paymentMethodPayables": [
            {
                "id": 86,
                "paymentDate": "2020-11-18",
                "type": "CASH"
            }
        ]
    },
]

# Buscar informações de uma conta

endpoint:
GET /account-payable/${accountPayableId}

payload:
{
    id: 1;
    description: "Comissão Veículo ABC-1234";
    paidTo: "Sale Man";
    totalValue: 1000000;
    overallStatus: "PAID";
    installmentsNumber: 10;
}

# Adicionar método de pagamento em uma parcela

endpoint:
POST /accounts-payable-installments/payment-method/${installmentId}

payload:
{
    "type": "CREDIT_CARD",
    "paymentDate": "2025-08-16"
}

## Contas a Receber

# Buscar contas a receber com filtro

endpoint: 
GET /account-receivable?page=1&startDate=2025-08-01&endDate=2025-08-08&overallStatus=PAID&orderBy=description

payload:
{
    total: 2,
    data: [
        {
            id: 1,
            description: "Conta a receber 1",
            receivedFrom: "Cliente A",
            totalValue: "10000", // Soma do valor de todas as parcelas
            overallStatus: "PENDING", // PAID quando todas as parcelas foram PAID e PENDING quando houver pelo menos 1 PENDING
            vehicleSaleId: 1 // ID da tabela VehicleSale,
            date: 2000-01-01 // Data de venda
        },
        {
            id: 2,
            description: "Conta a receber 2",
            receivedFrom: "Cliente B",
            totalValue: "5000",
            overallStatus: "PENDING",
            vehicleId: 1,
            date: 2000-01-01
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
        vehicleSaleId: 1, // Remover vehicleSaleId,
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

# Buscar veículo pelo ID

endpoint:
GET /vehicle/${vehicleId}

payload:
{
    payment: {
        purchaseDate: "2025-01-01;
        paidTo: "Fulano";
        value: 7000000; // Valor de compra
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
GET /vehicles?page=1&startDate=2025-08-01&endDate=2025-08-08&orderBy=modelName 
// Adicionar no status "inativos" e remover "status de atividade". Também não permitir filtrar por "vendido", pois ele pode ver os veículos vendidos na tela de vendas, isso também já impede edição/exclusão etc.
// Não validar pela placa, pois ele pode digitar parcialmente, só limitar quantidade de caracteres

# Listar gastos

endpoint:
GET /vehicle-expense/${vehicleId} // Ordenar gastos por data de competência

payload:
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

# Criar gasto do veículo

endpoint:
POST /vehicle-expense

payload: // Nos installments aceitar installmentSequence igual a 0, que representa a entrada. Verificar na venda e compra

# Criar veículo

endpoint
POST /vehicles

payload:
{
    "payment": {
        "purchaseDate": "2000-01-01",
        "paidTo": "Leilão", 
        "installment": {...}
    },
    "vehicle": {
        "plateNumber": "ABC1234", // Validar por placa duplicado (está aceitando duplicado)
        "chassiNumber": "AAAAAAAAAAAAAAAAA", // Validar por chassi duplicado (está dando erro interno)
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
    "characteristics": ["Air bag", "Direção hidráulica"]
}

# Editar veículo

endpoint:
PATCH /vehicles/${vehicleId}

payload:
{
    "characteristics": ["Ar condicionado", "Câmera de ré"],
    "payment": {
        "paidTo": "Leilão", // Não está aceitando null
        "purchaseDate": "2000-01-01"
    },
    "vehicle": {
        "kilometers": "2000",
        "plateNumber": "ABC1235", // Validar duplicado (não está validando)
        "announcedPrice": "9000000", // Validar duplicado (está dando erro interno)
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

# Venda do veículo

Não está aceitando valor da comissão como 0
Nos installments aceitar installmentSequence igual da compra e nos gastos