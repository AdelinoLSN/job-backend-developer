<!-- # Dolado: Teste prático para Backend

## Introdução
Este é o teste que nós da [Dolado](http://www.dolado.com.br) usamos para avaliar os candidatos de vagas para Backend. Do júnior ao sênior, todos são avaliados pelo mesmo teste mas por critérios distintos. Se você estiver participando de um processo seletivo para nossa equipe, certamente em algum momento receberá este link, mas caso você tenha chego aqui "por acaso", sinta-se convidado a desenvolver nosso teste e enviar uma mensagem para nós no e-mail `tech@dolado.com.br`.

A ideia deste teste é ser acessível para todos, mas de acordo com a vaga olhamos com maior rigor para alguns pontos. De todo modo, esperamos que no decorrer deste desafio você tenha uma ótima experiência e esteja satisfeito com o resultado final antes de enviá-lo. Por este motivo, não colocamos um prazo para a realização do teste e esperamos que você dedique o tempo necessário até estar satisfeito com o resultado.

Nós fazemos isso esperando que as pessoas mais iniciantes entendam qual o modelo de profissional que temos por aqui e que buscamos para o nosso time. Portanto, se você estiver se candidatando a uma vaga mais iniciante, não se assuste e faça o melhor que você puder!

## Instruções
Você deverá criar um `fork` deste projeto e desenvolver todo o teste em cima dele. Esperamos encontrar no *README* principal do seu repositório uma descrição minuciosa sobre:
- Como foi a experiência no decorrer de todo o processo de desenvolvimento?
- Quais foram as principais decisões tomadas?
- Como foi organizado o projeto em termos de estrutura de pastas e arquivos?
- Instruções de como rodar o projeto.

Lembre-se que este é um teste técnico e não um concurso público, portanto, não existe apenas uma resposta correta. Mostre que você é bom e nos impressione, mas não esqueça do objetivo do projeto.

## O Desafio
Você é um programador backend que já trabalha a muito tempo na área e, apesar de trabalhar duro durante a semana, seu hobby preferido sempre foi avaliar filmes. Tendo feito isso durante anos, suas anotações começaram a se perder entre os arquivos de um computador e outro e você teve a brilhante ideia de organizá-las numa api simples, de modo que pudesse sempre voltar e encontrar facilmente suas anotações sobre os filmes já vistos.

No intuito de desenvolver a api, como qualquer bom programador, você ficou com preguiça de preencher repetidamente uma infinidade de dados sobre cada filme assistido e resolveu simplificar a vida integrando com um serviço já existente ([The Open Movie Database](https://www.omdbapi.com/)).

Entre todas as suas anotações de filmes, encontramos também um esboço da api que você irá montar.

Começando por uma rota de criação de anotações: nela, a ideia é integrar com a api do OMDB e salvar todas as informações que julgar relevante para o banco de dados, trazendo obrigatoriamente a data de lançamento (campo "Released" da api do OMDB) e avaliação (campo "imdbRating" da api do OMDB), em conjunto com o "body" abaixo.  
```
Endpoint: '/movie-reviews'
Método: 'POST'
Body: {
    "title": string; // título é o que será usado para buscar as demais informações no OMDB
    "notes": string; // minhas anotações
}
```

Uma sugestão é usar o seguinte endpoint do OMDB para buscar as informações extras sobre o título em questão:
```
curl --location 'http://www.omdbapi.com/?apikey=aa9290ba&t=assassins%2Bcreed'
```

---

Em seguida, uma rota para listar as suas anotações. Nesta rota, você mesmo deixou como futura melhoria os filtros na query e a ordenação:
```
Endpoint: '/movie-reviews'
Método: 'GET'
```
**Opcional**
- Ter a capacidade de ordenar por data de lançamento e avaliação, de maneira ascendente ou descendente.
- Capacidade de filtrar as suas anotações por título, atores ou diretores (caso preciso, incluir os demais campos no banco de dados).

---

Listar uma anotação específica:
```
Endpoint: '/movie-reviews/:id'
Método: 'GET'
```

---

Atualizar uma anotação:
```
Endpoint: '/movie-reviews/:id'
Método: 'PUT'
```

---

Deletar uma anotação:
```
Endpoint: '/movie-reviews/:id'
Método: 'DELETE'
```

---

### Extra

Opcionalmente, encontramos algumas ideias de implementação que você deixou anotado mas acabou não tendo tempo de levar adiante:
```
TODO: Colocar paginação nas rotas de listagens
TODO: Ter uma boa documentação de todas as rotas da api e disponibilizá-las no endpoint "/docs"
TODO: Disponibilizar a api na internet. Para isso, gostaria de contar as visualizações que cada uma das minhas anotações vêm tendo. Criar também uma outra rota de listagem pra mostrar as mais visualizadas.
```

### Instruções de como gerar a chave de API
Você pode gerar a sua chave de api diretamente no site do [OMDB Api Keys](https://www.omdbapi.com/apikey.aspx). Um email de confirmação deve chegar na sua conta com as credenciais e você só precisa clicar no link para ativá-las.

Caso queira utilizar a nossa:
```
apikey: aa9290ba
```

### Requisitos do projeto
- API Rest em Typescript desenvolvida utilizando o framework [NestJS](https://nestjs.com/)
- Utilização do [Typeorm](https://docs.nestjs.com/recipes/sql-typeorm) para se comunicar com o banco de dados
- Banco de dados [MySQL](https://www.mysql.com/)


### O que nós ficaríamos felizes de ver em seu teste
* Testes unitários
* Body, query e params com algum tipo de validação
* Documentação de todos os endpoints da api
* Prettier e eslint configurados no projeto

### O que nos impressionaria
* Testes de integração
* Aplicação facilmente rodável usando docker-compose
* Tratamento de erros bem estruturado
* Uso adequado (caso necessário) de interceptors e guards
* Uso de repositórios para se comunicar com o banco

### O que nós não gostaríamos
* Descobrir que não foi você quem fez seu teste
* Ver commits grandes, sem muita explicação nas mensagens em seu repositório 
* Encontrar um um commit com as dependências de NPM

## O que avaliaremos de seu teste
* Histórico de commits do git
* As instruções de como rodar o projeto
* Organização, semântica, estrutura, legibilidade, manutenibilidade do seu código
* Alcance dos objetivos propostos -->
