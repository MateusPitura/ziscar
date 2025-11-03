import type { ReactNode } from "react";

export default function CustomersContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Nesta página, você pode visualizar todos os clientes cadastrados pela empresa na plataforma.
      </p>
      <p>
        Para adicionar um novo cliente, clique no botão verde “Adicionar cliente”,
        localizado no canto superior direito da página.
        Em seguida, preencha os campos obrigatórios marcados com um asterisco (*) e clique em “Salvar”.
        Para cancelar o cadastro, clique em “Cancelar”.
      </p>
      <p>
        Para filtrar a lista de clientes, clique no botão “Filtrar” e defina os critérios desejados.
      </p>
      <p>
        Para editar os dados de um cliente cadastrado, clique no botão com o símbolo de lápis,
        localizado no canto direito do item da tabela.
        Após realizar as alterações, clique em “Salvar” para confirmar ou em “Cancelar” para descartar as modificações.
      </p>
      <p>
        Para excluir um cliente, clique no botão vermelho em formato de lixeira,
        localizado no canto direito do item da tabela.
        Em seguida, no modal de confirmação, clique em “Desativar” para confirmar a exclusão
        ou em “Cancelar” para interromper o processo.
      </p>
      <p>
        Para navegar entre as páginas de clientes, utilize os botões “Anterior” e “Próxima”
        no rodapé da página.
      </p>
    </div>
  )
}