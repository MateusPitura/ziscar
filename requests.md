## Veículos

# Listar veículos

endpoint:
GET /vehicles?page=1&startDate=2025-08-01&endDate=2025-08-08&orderBy=modelName 

// Trazer os inativos apenas quando selecionar por "Inativo", ao selecionar "Todos os status" (talvez mudar essa label) trazer todos menos inativos e quando selecionar, ex.: "Comprado", trazer os "Comprados" que não são inativos