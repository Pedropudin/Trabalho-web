# Trabalho-web

Membros do Grupo:
- Davi Gabriel Domingues (15447497)
- Giovanna Nascimento Noventa (15637210)
- Pedro Martins Oliveira (13696213)

Uma loja online de produtos eletrônicos

---
# Mapa de Navegação
![mapa de navegação](mapa_navegacao.png "Mapa")

# Mockups das Páginas
Para ver os mockups criados para as páginas acesse o [nosso link do figma](https://www.figma.com/design/8Pk9ykizcWYiU7RxIeDDsV/Design-Principal?node-id=33-2&t=8IoWAMFarDPiJcpR-1)

# Requisitos

## Funcionalidade do Programa
Dividindo o programa na parte do cliente e do administrador da loja precisamos que cada um tenha as seguintes funcionalidades

### Parte do Cliente
Uma [página de recepção](Page-Initial/página_de_apresentação/index.html) para recepcionar o usuário com algumas informações básicas sobre o site e alguns dos associados

A [página de login](Page-Initial/página_de_login), onde o usuário utilizando um login e uma senha pode entrar na sua conta

```
Falta o negócio de criar conta e esqueci a senha
```

```
Não achei a página inicial, com os produtos recomendados e tals
```

O usuário também pode pesquisar o nome de um produto, sendo então redirecionado para a [página dos resultados da pesquisa](Page-Products/pagina_de_pesquisa/index.html).

O usuário pode optar por procurar um produto através do setor, sendo portanto redirecionado para a [página do setor]() específico.

Além disso, ao escolher um produto o usuário consegue acessar a [página específica desse produto](Page-Products/pagina_do_produto/index.html) e pode ainda prosseguir para a compra na [página de compra]()

```
Não tem a página de compra ainda
```

### Parte do Administrador
Caso o usuário entre como um administrador ele será levado para a [página incial da administração](Page-Adm/main.html), onde ele tem acesso a informações gerais sobre as vendas

Na página incial o administrador também pode acessar os [produtos]() onde ele consegue adicionar, remover e alterar os produtos anunciados

Por fim, o administrador pode entrar nas [pendências]() onde ele consegue ver perguntas, reclamações, envios pendentes e outras coisas que devem ser feitas

## Estruturação do HTML e CSS
A estruturação das páginas foi feita usando HTML para compor os elementos básicos, usando diversos `div` e `span` para estruturar a página.

Com a estrutura feita, bastou se basear nos mockups para adicionar as regras de CSS aos elementos.

# Descrição do Projeto
O projeto consiste de um website para a venda de produtos eletrônicos de uma loja fictícia chamada **Eletrocurte-se**.

O website possui duas partes, uma de acesso geral e uma de acesso apenas para administradores da loja.

A página de acesso geral é onde os usuários procuram por produtos para comprar.

A página dos administradores é onde os donos da loja podem não apenas controlar os produtos disponíveis para venda (adicionar, remover ou alterar) como também ver estatísticas sobre as vendas, responder perguntas e reclamações de usuários, verificar quais produtos esperam para serem enviados.