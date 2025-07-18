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

# Configurações para dados de exemplo gerados programaticamente
SAMPLE_DATA_CONFIG = {
    "eventos": {
        "default_count": 10,
        "max_count": 100,
        "locais": [
            "Centro de Convenções São Paulo",
            "Arena Anhembi",
            "Escola de Gastronomia Gourmet",
            "Museu de Arte Contemporânea",
            "Universidade de São Paulo",
            "Teatro Municipal",
            "Centro Cultural",
            "Auditório Principal",
            "Sala de Conferências",
            "Espaço de Eventos",
        ],
    },
    "participantes": {
        "default_count": 20,
        "max_count": 1000,
        "nomes": [
            "João Silva",
            "Maria Oliveira",
            "Pedro Santos",
            "Ana Costa",
            "Carlos Ferreira",
            "Fernanda Lima",
            "Roberto Almeida",
            "Juliana Souza",
            "Lucas Mendes",
            "Patrícia Rodrigues",
            "André Pereira",
            "Camila Silva",
            "Ricardo Santos",
            "Amanda Costa",
            "Diego Oliveira",
            "Carolina Lima",
            "Marcelo Almeida",
            "Vanessa Souza",
            "Thiago Mendes",
            "Bianca Rodrigues",
        ],
    },
    "ingressos": {
        "default_count": 50,
        "max_count": 5000,
    },
}
