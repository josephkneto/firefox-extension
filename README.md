### Projeto Tecnologias Hacker - 7º Semestre

O objetivo do projeto foi construir uma extensão para firefox capaz de avaliar a segurança e privacidade para o usuário no site em que esta navegando

<br>

## Como Testar a Extensão no Firefox

Para testar a extensão desenvolvida diretamente no Firefox, siga os passos abaixo:

1. **Clone o Repositório**

   Primeiro, você precisa clonar o repositório do projeto para o seu computador. Abra o terminal e execute o seguinte comando:
   ```bash
   git clone <URL-do-repositório>

2. **Abra o Firefox e Acesse a Página de Extensões**

   Abra o Firefox e digite about:debugging na barra de endereços. Pressione Enter. Isso abrirá a página de depuração de extensões.

3. **Habilite o Modo de Depuração**

   Na página de depuração, habilite o modo de depuração clicando no botão "Habilitar modo de depuração" se ainda não estiver ativado.

4. **Carregue a Extensão**

   Na seção "Extensões", clique no botão "Carregar Manifesto Temporário" (ou "Load Temporary Add-on"). Navegue até o diretório onde você clonou o repositório e selecione o arquivo manifest.json.

5. **Teste a Extensão**

   Agora, a extensão deve estar carregada no Firefox. Você verá um ícone da extensão na barra de ferramentas do navegador. Clique nesse ícone para abrir o popup e interagir com a extensão.
