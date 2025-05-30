# Trabalho-web

Membros do Grupo:
- Davi Gabriel Domingues (15447497)
- Giovanna Nascimento Noventa (15637210)
- Pedro Martins Oliveira (13696213)

Uma loja online de produtos eletrônicos

---
# Mapa de Navegação
![mapa de navegação](UX-eletrocurtese.png "Mapa")

Para ter uma visão melhor acesse o [projeto no milanote clicando aqui](https://app.milanote.com/1TWIzG1gYJgXeW?p=rvOTCrnhBY9).

# Mockups das Páginas
Os mockups das páginas podem ser encontrados no mapa de navegação ou na pasta [Pages-screenshots](Pages-screenshots/).

Segue também [nosso link do figma](https://www.figma.com/design/8Pk9ykizcWYiU7RxIeDDsV/Design-Principal?node-id=33-2&t=8IoWAMFarDPiJcpR-1) com alguns dos mockups, contudo alguns deles não estão atualizados, as versões mais atuais estão no mapa e na pasta citados anteriormente.

# Requisitos

## Funcionalidade do Programa
Dividindo o programa na parte do cliente e do administrador da loja precisamos que cada um tenha as seguintes funcionalidades:

### Parte do Cliente
Uma [página de recepção](Page-Initial/página_de_apresentação/index.html) para recepcionar o usuário com algumas informações básicas sobre o site e alguns dos associados

A [página de login](Page-Initial/página_de_login), onde o usuário utilizando um login e uma senha pode entrar na sua conta

Após entrar no site, o usuário pode entrar na página do seu perfil, de onde ele pode alterar informações, acessar as últimas compras, ver os últimos produtos entre outras funções.

Além disso, obviamente o usuário pode procurar por um produto para comprar, tendo então algumas opções para procurar esse produto, ele pode [procurar pelo nome](Page-Products/pagina_de_pesquisa/index.html) ou pelo [setor](Page-Products/pagina_de_setor/index.html).

Ao escolher um produto o usuário consegue acessar a [página específica desse produto](Page-Products/pagina_do_produto/index.html) e pode ainda prosseguir para a compra na página de compra.

### Parte do Administrador
Caso o usuário entre como um administrador ele será levado para a [página incial da administração](Page-Adm/main.html), onde ele tem acesso a informações gerais sobre as vendas.

Na página incial o administrador também pode acessar os produtos onde ele consegue adicionar, remover e alterar os produtos anunciados.

Por fim, o administrador pode entrar nas [pendências](Page-Adm/edit-product.html) onde ele consegue ver perguntas, reclamações, envios pendentes e outras atividades que devem ser feitas.

## Estruturação do HTML e CSS
A estruturação das páginas foi feita com HTML para compor os elementos básicos, usando diversos `div` e `span` para estruturar a página.

Com a estrutura feita, bastou se basear nos mockups para adicionar as regras de CSS aos elementos.

# Descrição do Projeto
O projeto consiste de um website para a venda de produtos eletrônicos de uma loja fictícia chamada **Eletrocurte-se**.

O website possui três partes, uma de acesso geral, uma do perfil e uma de acesso apenas para administradores da loja.

A página de acesso geral é onde os usuários procuram por produtos para comprar.

A página do perfil é onde os usuários podem verificar os históricos relacionados às interações com os produtos do site (visualização e compras), os dados pessoais, as mensagens do sistema e/ou do administrador, além de várias outras opções disponíveis.

A página dos administradores é onde os donos da loja podem não apenas controlar os produtos disponíveis para venda (adicionar, remover ou alterar) como também ver estatísticas sobre as vendas, responder perguntas e reclamações de usuários, verificar quais produtos esperam para serem enviados entre outras funcionalidades.

# Usando React

Esse projeto foi inicializado com [Create React App](https://github.com/facebook/create-react-app).

## Clonagem de repositório

Para utilizar suas dependências, é necessário cloná-lo do GitHub (comando: "git clone https://github.com/Pedropudin/Trabalho-web.git")

## Comandos disponíveis

No diretório do projeto você pode rodar: 

### `npm install`

Instala todas as dependências do aplicativo, para torná-lo utilizável

### `npm start`

Roda a aplicação no modo de desenvolvimento, com todas as bibliotecas presentes e suportadas pelo React (documentadas no package-lock.json)
Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ve-la.

<!--

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

-->
