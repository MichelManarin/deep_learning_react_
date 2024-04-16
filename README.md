# MVP Deep Learning


## Domain (Domínio):

Responsável pela lógica de negócios e regras do aplicativo.
Contém entidades e objetos de valor que representam conceitos do mundo real.
Não depende de nenhuma outra camada e é independente da implementação.

## Presentation (Apresentação):

Lida com a interface do usuário e interações.
Responsável pela apresentação dos dados ao usuário e pela recepção de entrada.
Pode incluir interfaces gráficas, APIs e lógica de apresentação.

## Data Layer (Camada de Dados):

Gerencia o acesso e a manipulação dos dados.
Inclui operações de leitura e gravação no banco de dados ou em outras fontes de dados.
Geralmente abstrai o acesso aos dados para que outras partes do aplicativo não precisem se preocupar com os detalhes de armazenamento.

## Infrastructure (Infraestrutura):

Fornece suporte técnico para o aplicativo.
Inclui serviços como logging, autenticação, notificação, etc.
Também pode envolver aspectos de configuração, gerenciamento de recursos e comunicação com sistemas externos.