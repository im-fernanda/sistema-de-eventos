// Script de inicialização do MongoDB
db = db.getSiblingDB("sistema_eventos");

// Criar usuário para o banco de dados
db.createUser({
  user: "django_user",
  pwd: "django_password",
  roles: [
    {
      role: "readWrite",
      db: "sistema_eventos",
    },
  ],
});

// Criar algumas coleções iniciais (opcional)
db.createCollection("eventos");
db.createCollection("participantes");
db.createCollection("ingressos");

print("MongoDB inicializado com sucesso!");
