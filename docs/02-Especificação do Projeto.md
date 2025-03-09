# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="1-Documentação de Contexto.md"> Documentação de Contexto</a></span>

Definição do problema e ideia de solução a partir da perspectiva do usuário. É composta pela definição do  diagrama de personas, histórias de usuários, requisitos funcionais e não funcionais além das restrições do projeto.

Apresente uma visão geral do que será abordado nesta parte do documento, enumerando as técnicas e/ou ferramentas utilizadas para realizar a especificações do projeto

## Personas
### Persona 1
![image](https://github.com/user-attachments/assets/58333bce-beb8-4bd3-a72e-3a6c6d064904)

Figura 1 - Primeira Persona

### Persona 2
![image](https://github.com/user-attachments/assets/184cd9ae-2ac5-4699-8517-acb83b68ecbe)

Figura 2 - Segunda Persona

### Persona 3
![image](https://github.com/user-attachments/assets/24a444cd-ca92-49c4-94fe-27ac82bd462a)

Figura 3 - Terceira Persona

### Persona 4
![image](https://github.com/user-attachments/assets/4e67e182-ef0d-4493-b4aa-56c4952370cf)

Figura 4 - Quarta Persona

### Persona 5
![image](https://github.com/user-attachments/assets/acf897df-e5cc-4404-aab8-52f0ec350e54)

Figura 5 - Quinta Persona

## Histórias de Usuários

Com base na análise das personas foram identificadas as seguintes histórias de usuários:

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
|Bruno | quero playlists dinâmicas que acompanhem a intensidade do meu treino | para que eu tenha motivação extra durante os exercícios. |
|Bruno | quero poder selecionar músicas com base no BPM | para garantir que a trilha sonora esteja sincronizada com meu ritmo de treino. |
|Camila | quero playlists que me ajudem a estimular a criatividade durante meu trabalho | para manter um fluxo produtivo sem distrações. |
|Camila | quero poder alternar entre diferentes gêneros musicais sem trocar de playlist | para que a trilha sonora acompanhe minha inspiração ao longo do dia. |
|Eduardo | quero playlists instrumentais que me ajudem a manter o foco durante cálculos e análises | para melhorar minha produtividade. |
|Eduardo | quero a opção de alternar automaticamente entre músicas e podcasts sem precisar sair do aplicativo | para facilitar o fluxo de trabalho. |
|Rafaela | quero playlists específicas para diferentes momentos de estudo | para que eu possa manter a concentração e otimizar meu tempo de aprendizado. |
|Rafaela | quero um temporizador integrado às playlists | para que a música mude conforme meu tempo de foco, ajudando a manter meu ritmo de estudos. |
|Marcelo | quero que o sistema sugira músicas baseadas no meu calendário | para que eu tenha trilhas sonoras adequadas para reuniões, trabalho e viagens. |
|Marcelo | quero integração com dispositivos inteligentes | para que a música se adapte automaticamente ao ambiente em que estou, proporcionando uma experiência mais fluida. |
## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| A aplicação deve permitir que o usuário avalie uma agência de intercâmbio com base na sua experiência| ALTA | 
|RF-002| A aplicação deve permitir que o usuário inclua comentários ao fazer uma avaliação de uma agência de intercâmbio    | ALTA |
|RF-003| A aplicação deve permitir que o usuário consulte todas as agências de intercâmbio cadastradas ordenando-as com base em suas notas | ALTA |

### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| A aplicação deve ser responsiva | MÉDIA | 
|RNF-002| A aplicação deve processar requisições do usuário em no máximo 3s |  BAIXA | 

Com base nas Histórias de Usuário, enumere os requisitos da sua solução. Classifique esses requisitos em dois grupos:

- [Requisitos Funcionais
 (RF)](https://pt.wikipedia.org/wiki/Requisito_funcional):
 correspondem a uma funcionalidade que deve estar presente na
  plataforma (ex: cadastro de usuário).
- [Requisitos Não Funcionais
  (RNF)](https://pt.wikipedia.org/wiki/Requisito_n%C3%A3o_funcional):
  correspondem a uma característica técnica, seja de usabilidade,
  desempenho, confiabilidade, segurança ou outro (ex: suporte a
  dispositivos iOS e Android).
Lembre-se que cada requisito deve corresponder à uma e somente uma
característica alvo da sua solução. Além disso, certifique-se de que
todos os aspectos capturados nas Histórias de Usuário foram cobertos.

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |


Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

## Diagrama de Casos de Uso

Desenvolvemos o Diagrama de Casos de Uso compondo os principais requisitos essenciais para o desenvolvimento correto da plataforma, para os usuários e dentro do sistema.


![Diagrama de Caso de Uso - Moodify](https://github.com/user-attachments/assets/abad9a0f-8958-45c1-b1c7-420940864052)

