# Système de Calcul Distribué avec RabbitMQ

Ce projet implémente un système de calcul distribué utilisant RabbitMQ pour effectuer des opérations mathématiques de manière distribuée.

## Prérequis

- Docker et Docker Compose
- Git

## Installation

1. Cloner le repository :

```bash
git clone [URL_DU_REPO]
cd rabit
```

## Démarrage

Pour démarrer l'ensemble du système (RabbitMQ, workers, clients) :

```bash
docker-compose up -d
```

Pour voir les logs en temps réel :

```bash
docker-compose logs -f
```

Pour arrêter le système :

```bash
docker-compose down
```

## Accès aux Services

- Interface de gestion RabbitMQ : http://localhost:15672
  - Utilisateur : guest
  - Mot de passe : guest

## Structure du Projet

- `src/client.js` : Client qui génère et envoie les opérations
- `src/worker.js` : Workers qui effectuent les calculs
- `src/result.js` : Client qui affiche les résultats
- `docker-compose.yml` : Configuration Docker pour tous les services
- `Dockerfile` : Configuration de l'image Docker pour l'application

## Fonctionnalités

- Opérations supportées : addition, soustraction, multiplication, division
- Support de l'opération "all" qui envoie le calcul à tous les workers
- Simulation de calculs complexes avec délais aléatoires
- Système de file d'attente durable
- Gestion des erreurs et des cas particuliers (division par zéro)

## Architecture Docker

Le système est composé de 7 conteneurs Docker :

1. `rabbitmq` : Serveur RabbitMQ avec interface de gestion
2. `worker-add` : Worker pour les additions
3. `worker-sub` : Worker pour les soustractions
4. `worker-mul` : Worker pour les multiplications
5. `worker-div` : Worker pour les divisions
6. `client` : Client qui envoie les opérations
7. `result` : Client qui affiche les résultats

Tous les conteneurs sont connectés via un réseau Docker dédié (`rabit-network`).

## Améliorations Possibles

- Interface graphique pour l'envoi des opérations
- Interface d'administration pour surveiller les workers
- Système de logging plus détaillé
- Tests unitaires et d'intégration
- Monitoring des performances
