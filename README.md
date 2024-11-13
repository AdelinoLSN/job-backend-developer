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

# Dolado: Teste prático para Backend

### Como foi a experiência no decorrer de todo o processo de desenvolvimento?

O fato do projeto ser o mesmo independentemente do nível do candidato, é uma ótima forma de instigar o candidato a tentar incorporar o máximo de técnicas e boas práticas que ele possua em seu arsenal. O que me fez pensar bastante em como estruturar a base de dados e a própria organização de pastas antes de começar.

A experiência em si foi desafiadora, pois tive que aprender a utilizar o _NestJS_ e o _TypeORM_, o que foi muito interessante, pois o _TypeORM_ é uma ferramenta que eu ainda não tive a oportunidade de atuar profissionalmente, pelo menos não o quanto gostaria. Entender todas as facilidade e dificuldades que ferramentas com esse nível de maturidade proporcionaram foi de grande valia e no começo me consumiu um tempo considerável no planejamento do projeto junto a essas ferramentas.

### Quais foram as principais decisões tomadas?

A primeira decisão tomada teve relação com a base de dados, entender como modelar a estrutura de forma a atender os objetivos utilizando tudo que o _TypeORM_ tem a oferecer e também tudo que ele pode me limitar.

Um exemplo foi a relação `ManyToMany` que não poderia possuir campos customizados (colunas com valores além dos relacionamentos na tabela pivô) sem torna-la uma entidade própria e a fim de evitar utilização de _query builder_ e _raw query_ na aplicação, optei por criar um relacionamento `OneToMany` entre _Movie_ e _Actor_ e _Director_, que me permitiu criar um `ManyToMany` entre _Movie_ e _Person_ e assim conseguir buscar os atores e diretores de um filme de forma mais simples, claro, sempre relacionando _Director_ e _Actor_ com _Person_ por meio de um relacionamento `OneToOne` a fim de evitar duplicidade de dados, afinal, não são raros os casos de um ator ser também diretor.

Uma outra decisão foi relacionada ao módulo de contagem de visualizações de reviews de filmes, onde optei por criar uma entidade a parte para evitar que a entidade _MovieReview_ tivesse seus metadados atualizados a cada visualização, optei então por criar uma entidade fraca _MovieReviewView_ que possui um relacionamento `OneToOne` com _MovieReview_ e um campo `count` para essa contagem.

O funcionamento dessa contagem ocorre via o _interceptor_ `IncrementMovieReviewViewsInterceptor` que intercepta a requisição de visualização de um review e em caso de sucesso, adiciona a uma fila de processamento essas visualizações.

Sendo _MovieReviewView_ uma entidade fraca, utilizar somente o código para gerenciar a criação e posterior atualização poderia gerar questões de problemas de concorrência, então optei por utilizar o conceito de fila com o _Redis_ e o _BullMQ_ para gerenciar a contagem de visual, onde a cada visualização, uma mensagem é adicionada a fila e um _worker_ é responsável por processar essas mensagens e atualizar a contagem de visualizações em ordem para evitar os problemas já citados. 

Outra relevante decisão foi relacionada a organização do projeto, optei por separar na organização de módulos, onde cada pasta na página `modulos/` possui um módulo, _controller_ (caso necessário), _service_, _entity_, seus testes unitários uma abstração para o _repository_ do TypeORM que me daria mais flexibilidade para implementar repositórios customizados sem que o `service` tenha conhecimento de como o `_TypeORM_` está implementando a persistência.

Um ponto de questionamento foi relacionado aos testes unitários ficarem juntos dos arquivos que estão sendo testados, o que me fez questionar se não seria melhor separar os testes em uma pasta própria, mas optei por manter juntos, pois acredito que dada estrutura que eu gostaria de passar que é de realmente cada pasta de `modules/` ser um módulo com começo, meio e fim, julguei que faria mais sentido manter os testes juntos dos arquivos que estão sendo testados.

Por outro lado, os testes de integração foram adicinados à pasta de `test/` na raiz do projeto, pois eles testam múltiplos módulos e não apenas um, por mais que os arquivos sejam organizados baseados em cima de um _controller_ de um módulo específico, então julguei que essa separação seria necessária. Obviamente veio a dúvida posterior sobre organizar os testes de integração em uma pasta própria dentro de `test/`, mas no fim, acredito que a organização atual expressaria melhor a forma como eu entendi a estrutura mais conveniente para o projeto.

### Como foi organizado o projeto em termos de estrutura de pastas e arquivos?

Como já mencionado, a organização foi feita em módulos, onde cada pasta na página `modulos/` possui um módulo, _controller_ (caso necessário), _service_, _entity_, seus testes unitários uma abstração para o _repository_ do TypeORM que me dar mais flexibilidade para implementar repositórios customizados sem que o `service` tenha conhecimento de como o `_TypeORM_` está implementando a persistência.

Em detalhes, a estrutura de pastas ficou da seguinte forma:

* `src/` - Pasta contendo todo o código fonte
    * `common/` - Pasta contendo arquivos comuns a toda a aplicação
        * `exceptions/` - Pasta contendo exceções customizadas
        * `interceptors/` - Pasta contendo interceptors customizados
    * `modules/` - Pasta contendo os módulos da aplicação separados por entidade
        * `${nomeDaEntidade}/` - Pasta contendo o módulo da entidade
            * `${nomeDaEntidade}.module.ts` - Módulo da entidade
            * `${nomeDaEntidade}.controller.ts` - Controller da entidade (caso necessário)
            * `${nomeDaEntidade}.entity.ts` - Entidade da entidade
            * `${nomeDaEntidade}.service.ts` - Service da entidade
            * `${nomeDaEntidade}.service.spec.ts` - Testes unitários do service da entidade
* `test/` - Pasta com os testes de integração
    * `helpers/` - Pasta com funções auxiliares para os testes
    * `factories/` - Pasta com factories para criação de entidades para os testes
    * `e2e/` - Pasta com os testes de integração
        * `${nomeDaEntidade}.e2e-spec.ts` - Testes de integração da entidade

### Instruções de como rodar o projeto.

O projeto foi desenvolvido para que possa ser rodado diretamente ou por meio de um container _Docker_.

Para rodar o projeto diretamente, é necessário ter o _Node_, _MySQL_ e o _Redis_ instalados na máquina. Após clonar o repositório, é necessário instalar as dependências do projeto com o comando `npm install`, realizar um cópia do arquivo `.env.example` para `.env` e preencher as variáveis de ambiente necessárias (banco de dados, Redis e chave da API do OMDB). Após isso, basta rodar o comando `npm run start:dev` para rodar o projeto em modo de desenvolvimento, ou `npm run build` e `npm run start:prod` para rodar em modo de produção.

Para rodar o projeto por meio de um container _Docker_, é necessário ter o _Docker_ e o _Docker Compose_ instalados na máquina. Após clonar o repositório, também é necessário copiar o arquivo `.env.dovker.example` para `.env.docker` e preencher as variáveis de ambiente necessárias (chave da API do OMDB). Após isso, basta rodar o comando `docker-compose up` para iniciar os containers da aplicação e do banco de dados. Os arquivos de persistência do banco de dados ficarão na pasta `.docker/db/` e o projeto estará disponível por padrão em `http://localhost:3000`.
