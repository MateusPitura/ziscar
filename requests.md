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
GET /vehicle-sale/${vehicleSaleId}

payload: 
{
    <vehicle>
}

# Buscar veículo

endpoint:
GET /vehicle/${vehicleId}

payload:
{
    <vehicle>
}

# Listar veículos

endpoint:
GET /vehicle?page=1&startDate=2025-08-01&endDate=2025-08-08&orderBy=modelName

payload:
{
    total: 0,
    data: <fetchVehicle>[]
}

# Listar gastos

endpoint:
GET /vehicle-expense/${vehicleId}

payload:
{
    <vehicleExpense>[]
}

# Buscar gasto por id do gasto

endpoint:
GET /vehicle-expense/${expenseId}

payload:
{
    <vehicleExpense>
}

# Ativar veículo

endpoint:
DELETE /vehicle/${vehicleId}

payload:
{
    archivedAt: null
}

# Desativar veículo

endpoint:
DELETE /vehicle/${vehicleId}

payload:
{
    archivedAt: '2025-01-01'
}

# Criar veículo

endpoint
POST /vehicle

payload:
{
    payment: {
        purchaseDate: "2025-01-01",
        paidTo: "Paid to",
        installment: <installment>
    },
    vehicle: <vehicle>,
    characteristics: {
        commonCharacteristics: [],
        newCharacteristics: []
    }
}

# Editar veículo

endpoint:
PATH /vehicle/${vehicleId}

payload:
{
    payment: {
        purchaseDate: "2025-01-01",
        paidTo: "Paid to",
    },
    vehicle: <vehicle>,
    characteristics: {
        commonCharacteristics: [],
        newCharacteristics: []
    } 
}

# Editar gasto do veículo

endpoint:
PATCH /vehicle-expense/${expenseId}

payload:
{
    payment: {
        observations: "Observations",
        category: "",
        competencyDate: "2025-01-01",
    }
}

# Criar gasto do veículo

endpoint:
POST /vehicle-expense

payload:
{
    payment: {
        observations: "Observations",
        category: "",
        competencyDate: "2025-01-01",
        installment: <installment>
    }
}

# Vender veículo

# Desativar um gasto do veículo

endpoint:
DELETE /vehicle-expense/${vehicleId}

payload:
{
    archivedAt: "2025-01-01"
}

# Ativar um gasto do veículo