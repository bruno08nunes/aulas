Esta é a fase de construir o "cérebro" da aplicação, implementando a lógica de negócios e a comunicação com o banco de dados.

Atividades:

Criação da API: Desenvolva uma API (preferencialmente RESTful) com endpoints para todas as funcionalidades do frontend.
Exemplos: POST /login, GET /turmas, POST /turmas, GET /turmas/{id}/alunos, POST /chamada, etc.
Autenticação e Autorização:
Implemente um sistema de login seguro.
Garanta que cada endpoint só possa ser acessado por perfis autorizados (ex: um aluno não pode criar uma turma).
Regras de Negócio:
Codifique todas as operações de criação, leitura, atualização e exclusão (CRUD) para as entidades definidas na Tarefa 3.
Conexão com o Frontend: Integre a API com o frontend desenvolvido na Tarefa 2, substituindo os dados mocados por chamadas reais.
Entregável da Tarefa 4:

Código-fonte do backend com a API totalmente funcional e integrada ao frontend.