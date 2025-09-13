<!-- ## Contas a Pagar -->
<!-- 
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
} -->

<!-- # Buscar parcelas de uma conta a pagar -->

<!-- endpoint: 
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
] -->

<!-- # Buscar informações de uma conta -->

<!-- endpoint:
GET /account-payable/${accountPayableId}

payload:
{
    id: 1;
    description: "Comissão Veículo ABC-1234";
    paidTo: "Sale Man";
    totalValue: 1000000;
    overallStatus: "PAID";
    installmentsNumber: 10;
} -->

# Adicionar método de pagamento em uma parcela

endpoint:
POST /accounts-payable-installments/payment-method/${installmentId}

payload:
{
    "type": "CREDIT_CARD",
    "paymentDate": "2025-08-16"
}

## Contas a Receber

<!-- # Buscar contas a receber com filtro

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
            totalValue: "10000",
            overallStatus: "PENDING",
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
} -->

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

# Listar veículos

endpoint:
GET /vehicles?page=1&startDate=2025-08-01&endDate=2025-08-08&orderBy=modelName 
// Trazer os inativos apenas quando selecionar por "Inativo", ao selecionar "Todos os status" (talvez mudar essa label) trazer todos menos inativos e quando selecionar, ex.: "Comprado", trazer os "Comprados" que não são inativos