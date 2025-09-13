## Contas a Pagar

# Adicionar método de pagamento em uma parcela

endpoint:
POST /accounts-payable-installments/payment-method/${installmentId}

// Ao adicionar um método de pagamento o status da parcela deve mudar para "PAID"