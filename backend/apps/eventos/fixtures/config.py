"""
Configurações para os dados iniciais do sistema de eventos.
"""

# Configurações dos dados iniciais
INITIAL_DATA_CONFIG = {
    "eventos": {
        "count": 5,
        "templates": [
            {
                "nome": "Tech Conference 2024",
                "local": "Centro de Convenções São Paulo",
                "capacidade": 500,
                "descricao": "A maior conferência de tecnologia do Brasil, com palestras sobre IA, blockchain e desenvolvimento web.",
                "preco_ingresso": 150.00,
            },
            {
                "nome": "Show de Rock Nacional",
                "local": "Arena Anhembi",
                "capacidade": 2000,
                "descricao": "Show especial com as maiores bandas de rock nacional dos anos 80 e 90.",
                "preco_ingresso": 80.00,
            },
            {
                "nome": "Workshop de Culinária",
                "local": "Escola de Gastronomia Gourmet",
                "capacidade": 30,
                "descricao": "Aprenda técnicas avançadas de culinária com chefs renomados.",
                "preco_ingresso": 200.00,
            },
            {
                "nome": "Exposição de Arte Moderna",
                "local": "Museu de Arte Contemporânea",
                "capacidade": 100,
                "descricao": "Exposição com obras de artistas brasileiros contemporâneos.",
                "preco_ingresso": 25.00,
            },
            {
                "nome": "Maratona de Programação",
                "local": "Universidade de São Paulo",
                "capacidade": 150,
                "descricao": "Competição de programação para estudantes e profissionais.",
                "preco_ingresso": 50.00,
            },
        ],
    },
    "participantes": {
        "count": 8,
        "nomes": [
            "João Silva Santos",
            "Maria Oliveira Costa",
            "Pedro Almeida Lima",
            "Ana Paula Ferreira",
            "Carlos Eduardo Souza",
            "Fernanda Rodrigues",
            "Roberto Mendes Silva",
            "Juliana Costa Santos",
        ],
    },
    "ingressos": {
        "count": 12,
        "tipos": ["VIP", "PADRAO", "ESTUDANTE", "IDOSO"],
        "status": ["ATIVO", "USADO", "CANCELADO"],
        "descontos": {
            "VIP": 1.5,  # 50% mais caro
            "PADRAO": 1.0,  # Preço normal
            "ESTUDANTE": 0.5,  # 50% de desconto
            "IDOSO": 0.5,  # 50% de desconto
        },
    },
}

