# 🍰 CakeDelight

### Cloud Native Cake Ordering & Management System

CakeDelight is a cloud-native cake ordering application built using a **microservices architecture**. The system provides cake catalog management, order processing, ratings/reviews, notifications, API gateway routing, asynchronous messaging, containerization, and Kubernetes deployment.

The project demonstrates:

- Spring Boot microservices
- RESTful APIs
- Spring Cloud Gateway
- MySQL databases
- RabbitMQ asynchronous messaging
- React frontend
- Docker & Docker Compose
- Kubernetes & Minikube
- Kubernetes Secrets and persistent storage
- Postman API testing

---

# 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Microservices](#-microservices)
- [Project Structure](#-project-structure)
- [Service Communication](#-service-communication)
- [Database Architecture](#-database-architecture)
- [RabbitMQ Communication](#-rabbitmq-communication)
- [API Gateway](#-api-gateway)
- [Frontend](#-frontend)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Running Locally with Docker Compose](#-running-locally-with-docker-compose)
- [☸️ Deploying on Kubernetes with Minikube](#️-deploying-on-kubernetes-with-minikube)
- [🧪 Testing the Deployment](#-testing-the-deployment)
- [API Endpoints](#-api-endpoints)
- [Order Processing Flow](#-order-processing-flow)
- [Rating Flow](#-rating-flow)
- [Notification Flow](#-notification-flow)
- [Postman Testing](#-postman-testing)
- [Configuration & CORS](#-configuration--cors)
- [Persistent Storage](#-persistent-storage)
- [Troubleshooting](#-troubleshooting)
- [Stopping the Application](#-stopping-the-application)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

# 📖 Project Overview

CakeDelight is designed as a distributed cake ordering platform.

A customer can:

1. Browse available cakes.
2. View cake details.
3. Add cakes to a shopping cart.
4. Change item quantities.
5. Place an order.
6. View previous orders.
7. Submit ratings and reviews.
8. Receive notifications about completed orders.

The backend is divided into independent microservices. The frontend communicates with the backend through the **API Gateway**, while RabbitMQ is used for asynchronous order-completion notifications.

---

# 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │      FRONTEND       │
                         │   React + Vite      │
                         │     Port: 3000      │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP
                                    ▼
                         ┌─────────────────────┐
                         │     API GATEWAY     │
                         │  Spring Cloud       │
                         │     Gateway         │
                         │     Port: 8080      │
                         └──────────┬──────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
       ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
       │ Catalog Service│  │ Order Service  │  │ Rating Service │
       │    :8081       │  │    :8082       │  │    :8083       │
       └───────┬────────┘  └───────┬────────┘  └───────┬────────┘
               │                   │                   │
               ▼                   ▼                   ▼
          MySQL DB            MySQL DB             MySQL DB

                               │
                               │ RabbitMQ
                               ▼
                       ┌──────────────────┐
                       │ Notification     │
                       │ Service :8084    │
                       └────────┬─────────┘
                                │
                                ▼
                           MySQL DB

                 ┌────────────────────────────┐
                 │          RabbitMQ          │
                 │   Asynchronous Messaging   │
                 └────────────────────────────┘
```

---

# 🔧 Technology Stack

## Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Spring Cloud Gateway
- Spring Cloud OpenFeign
- Maven

## Database

- MySQL
- JPA/Hibernate

## Messaging

- RabbitMQ
- Spring AMQP

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Query

## DevOps

- Docker
- Docker Compose
- Kubernetes
- Minikube
- kubectl
- Kubernetes Services
- Kubernetes ConfigMaps
- Kubernetes Secrets
- Persistent Volumes
- Persistent Volume Claims

## Testing

- Postman

---

# 🧩 Microservices

| Component            | Port | Responsibility                         |
| -------------------- | ---: | -------------------------------------- |
| API Gateway          | 8080 | Single entry point and request routing |
| Catalog Service      | 8081 | Cake catalog management                |
| Order Service        | 8082 | Order creation and checkout            |
| Rating Service       | 8083 | Cake ratings and reviews               |
| Notification Service | 8084 | Customer notifications                 |
| Frontend             | 3000 | User interface                         |
| MySQL                | 3306 | Persistent relational storage          |
| RabbitMQ             | 5672 | Asynchronous messaging                 |

---

# 📁 Project Structure

```text
CakeDelight/
│
├── api-gateway/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── catalog-service/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── order-service/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── rating-service/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── notification-service/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker/
│   ├── docker-compose.yml
│   └── ...
│
├── kubernetes/
│   ├── catalog/
│   ├── config/
│   ├── gateway/
│   ├── infrastructure/
│   ├── notification/
│   ├── order/
│   └── rating/
│
├── postman/
│   └── API collections
│
└── README.md
```

---

# 🔄 Service Communication

CakeDelight uses both synchronous and asynchronous communication.

## 1. Synchronous Communication

HTTP/REST is used when an immediate response is required.

```text
Frontend
   │
   ▼
API Gateway
   │
   ├──► Catalog Service
   │
   ├──► Order Service
   │
   ├──► Rating Service
   │
   └──► Notification Service
```

## 2. Asynchronous Communication

RabbitMQ is used for order-completion events.

```text
Order Service
      │
      │ OrderCompletedEvent
      ▼
   RabbitMQ
      │
      │ order.completed.key
      ▼
Notification Service
```

---

# 🗄️ Database Architecture

Each backend microservice owns its own database.

```text
MySQL
│
├── cakedelight_catalog
├── cakedelight_order
├── cakedelight_rating
└── cakedelight_notification
```

This follows the **Database-per-Service** microservice pattern.

---

# 🐇 RabbitMQ Communication

RabbitMQ provides asynchronous communication between the Order Service and Notification Service.

## Exchange

```text
order.exchange
```

## Queue

```text
order.completed.queue
```

## Routing Key

```text
order.completed.key
```

## Event Flow

```text
Customer
   │
   ▼
Order Service
   │
   ├── Save Order → MySQL
   │
   └── Publish OrderCompletedEvent
                 │
                 ▼
              RabbitMQ
                 │
                 ▼
       order.completed.queue
                 │
                 ▼
       Notification Service
                 │
                 ▼
              MySQL
```

Example event:

```json
{
  "orderId": 1,
  "customerEmail": "customer@example.com",
  "totalAmount": 1100.0,
  "completedAt": "2026-08-13T10:30:00"
}
```

---

# 🌐 API Gateway

The API Gateway provides a single backend entry point for the frontend and API clients.

The main routes are:

```text
/cakes/**          → Catalog Service
/orders/**         → Order Service
/ratings/**        → Rating Service
/notifications/**  → Notification Service
```

Frontend/API clients should normally use:

```text
http://localhost:8080
```

instead of directly calling individual backend services.

---

# 🎨 Frontend

The frontend is located in:

```text
frontend/
```

It is implemented using:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Query

The frontend provides the user interface for:

- Cake catalog
- Cake details
- Reviews and ratings
- Shopping cart
- Checkout
- Orders
- Notifications

---

# ⚙️ Prerequisites

Make sure you have the following installed on your machine:

- **Docker & Docker Compose**
- **Minikube & kubectl**
- **Java 21 & Maven** (if building locally)
- **Git**

For frontend development outside Docker, Node.js and npm are also required.

---

# 🚀 Running Locally with Docker Compose

Docker Compose is the quickest way to start the complete CakeDelight stack locally.

## 1. unzip the repository

```bash
unzip NajimTamboli_CapstoneProject_Cohort2.zip
```

## 2. Navigate to the Docker directory

```bash
cd NajimTamboli_CapstoneProject_Cohort2
cd docker
```

## 3. Build and start the complete stack

```bash
docker compose up --build -d
```

The `--build` option ensures that Docker rebuilds the application images before starting the containers.

## 4. Check running containers

```bash
docker ps
```

## 5. Check logs if required

```bash
docker compose logs
```

To follow logs for a specific service:

```bash
docker compose logs -f order-service
```

## 6. Access the application

Open:

```text
http://localhost:3000
```

Use the frontend port configured in the Docker Compose file if it differs from `3000`.

---

# ☸️ Deploying on Kubernetes with Minikube

CakeDelight can be deployed inside a local Kubernetes cluster using Minikube.

The recommended deployment order is:

```text
Minikube
   ↓
Docker images
   ↓
Infrastructure
   ↓
Configuration / Secrets
   ↓
Microservices
   ↓
API Gateway
   ↓
Frontend
```

## 1. Start Minikube & Configure Docker Daemon

Start Minikube:

```bash
minikube start
```

Configure the terminal to use Minikube's internal Docker environment so locally built images are available to Kubernetes.

### Windows PowerShell

```powershell
minikube docker-env | Invoke-Expression
```

### Linux/macOS / Git Bash

```bash
eval $(minikube docker-env)
```

> Run the appropriate command for the terminal you are using. The Linux/macOS command does not work unchanged in standard Windows PowerShell.

Verify the cluster:

```bash
kubectl cluster-info
```

---

## 2. Build Images inside Minikube

Navigate to the Docker directory:

```bash
cd docker
```

Build the images using Docker Compose:

```bash
docker compose build
```

Verify the images:

```bash
docker images
```

The image names must match the image names referenced by the Kubernetes Deployment manifests.

---

## 3. Apply Kubernetes Manifests

From the **project root directory**, apply all Kubernetes manifests recursively:

```bash
kubectl apply -R -f kubernetes/
```

This applies the Kubernetes resources contained under the `kubernetes/` directory, including resources such as:

- Secrets
- ConfigMaps
- Deployments
- Services
- Persistent storage resources

> If your manifests require infrastructure to be ready before application services start, you may apply the infrastructure/configuration manifests first and then the application manifests. Kubernetes will continue reconciling resources until their dependencies become available.

---

## 4. Verify Pod Status

Check the pods:

```bash
kubectl get pods
```

Watch pods until they become ready:

```bash
kubectl get pods -w
```

All required application and infrastructure pods should eventually show a healthy state such as:

```text
Running
```

For example:

```text
api-gateway-xxxxxxxxx-xxxxx           1/1   Running
catalog-service-xxxxxxxxx-xxxxx       1/1   Running
order-service-xxxxxxxxx-xxxxx         1/1   Running
rating-service-xxxxxxxxx-xxxxx        1/1   Running
notification-service-xxxxxxxxx-xxxxx  1/1   Running
mysql-db-xxxxxxxxx-xxxxx              1/1   Running
rabbitmq-xxxxxxxxx-xxxxx              1/1   Running
frontend-xxxxxxxxx-xxxxx               1/1   Running
```

Pod names will vary because Kubernetes generates them dynamically.

---

# 🧪 Testing the Deployment

After the Kubernetes pods are running, expose the Frontend and API Gateway using `kubectl port-forward`.

Open **two separate terminals**.

## Terminal 1 — Frontend

```bash
kubectl port-forward svc/frontend 8085:3000
```

## Terminal 2 — API Gateway

```bash
kubectl port-forward svc/api-gateway 8080:8080
```

Then open the application in your browser:

```text
http://localhost:8085
```

The frontend can communicate with the backend through the API Gateway on:

```text
http://localhost:8080
```

Keep both port-forward terminals running while testing the application.

---

# 🔍 Kubernetes Verification Commands

## Pods

```bash
kubectl get pods
kubectl get pods -o wide
```

## Services

```bash
kubectl get services
```

or:

```bash
kubectl get svc
```

## Deployments

```bash
kubectl get deployments
```

## Persistent Volumes

```bash
kubectl get pv
```

## Persistent Volume Claims

```bash
kubectl get pvc
```

## ConfigMaps

```bash
kubectl get configmaps
```

## Secrets

```bash
kubectl get secrets
```

---

# 📜 Kubernetes Logs

View Order Service logs:

```bash
kubectl logs deployment/order-service
```

Follow Order Service logs:

```bash
kubectl logs -f deployment/order-service
```

Notification Service:

```bash
kubectl logs -f deployment/notification-service
```

API Gateway:

```bash
kubectl logs -f deployment/api-gateway
```

If a pod has restarted, check its previous logs:

```bash
kubectl logs <pod-name> --previous
```

---

# 🧪 API Endpoints

The frontend and external clients should normally access these APIs through the API Gateway.

## 🍰 Catalog Service

Base path:

```text
/cakes
```

Typical operations:

```http
GET    /cakes
GET    /cakes/{id}
POST   /cakes
PUT    /cakes/{id}
DELETE /cakes/{id}
```

Example:

```http
GET http://localhost:8080/cakes
```

## 🛒 Order Service

Base path:

```text
/orders
```

Typical operations:

```http
POST /orders
GET  /orders/{id}
GET  /orders/customer/{email}
PUT  /orders/{id}
POST /orders/{id}/checkout
```

## ⭐ Rating Service

Base path:

```text
/ratings
```

Typical operations:

```http
POST /ratings
GET  /ratings/cake/{cakeId}
GET  /ratings/cake/{cakeId}/average
```

## 🔔 Notification Service

Base path:

```text
/notifications
```

Typical operations:

```http
GET /notifications
GET /notifications/customer/{email}
```

> The exact request and response bodies should follow the DTOs and controller mappings implemented in the respective services.

---

# 🔄 Order Processing Flow

```text
Customer
   │
   │ Checkout
   ▼
Frontend
   │
   ▼
API Gateway
   │
   ▼
Order Service
   │
   ├──► Save Order → MySQL
   │
   └──► Publish OrderCompletedEvent
                    │
                    ▼
                 RabbitMQ
                    │
                    ▼
          order.completed.queue
                    │
                    ▼
          Notification Service
                    │
                    ▼
                  MySQL
```

---

# ⭐ Rating Flow

```text
Customer
   │
   │ Submit rating/review
   ▼
Frontend
   │
   ▼
API Gateway
   │
   ▼
Rating Service
   │
   ▼
Rating Database
```

---

# 🔔 Notification Flow

The notification workflow is event-driven.

```text
Order Service
      │
      │ Order completed
      ▼
OrderCompletedEvent
      │
      ▼
RabbitMQ
      │
      ▼
order.completed.queue
      │
      ▼
Notification Service
      │
      ▼
Notification Repository
      │
      ▼
MySQL
```

This keeps the Order Service and Notification Service loosely coupled.

---

# 📮 Postman Testing

The project contains Postman resources under:

```text
postman/
```

Recommended testing sequence:

1. Start MySQL and RabbitMQ.
2. Start or deploy all backend services.
3. Start the API Gateway.
4. Test Catalog APIs.
5. Test Rating APIs.
6. Place/complete an order.
7. Verify the RabbitMQ event.
8. Check Notification APIs.

Example:

```http
GET http://localhost:8080/cakes
```

After completing an order:

```http
GET http://localhost:8080/notifications
```

---

# 🐇 Verifying RabbitMQ

For local Docker execution, RabbitMQ Management UI is commonly available at:

```text
http://localhost:15672
```

For Kubernetes, find the RabbitMQ pod:

```bash
kubectl get pods
```

Then inspect queues:

```bash
kubectl exec -it <rabbitmq-pod> -- rabbitmqctl list_queues
```

Inspect exchanges:

```bash
kubectl exec -it <rabbitmq-pod> -- rabbitmqctl list_exchanges
```

Inspect bindings:

```bash
kubectl exec -it <rabbitmq-pod> -- rabbitmqctl list_bindings
```

Expected application messaging resources include:

```text
Exchange: order.exchange
Queue:    order.completed.queue
Routing:  order.completed.key
```

---

# 🔒 Configuration & CORS

The API Gateway is configured with a global CORS filter to allow requests from the local development and containerized environments.

The gateway uses an allowed-origin pattern equivalent to:

```java
setAllowedOriginPatterns(List.of("*"))
```

This allows frontend requests from different origins during development.

> For production deployments, CORS should be restricted to the actual trusted frontend domains rather than allowing all origins.

## Kubernetes Secrets

Database and messaging credentials are managed using Kubernetes Secrets.

The project uses the Kubernetes Secret:

```text
cakedelight-secrets
```

Secrets are referenced by the application deployments instead of requiring credentials to be hardcoded into application source code.

---

# 💾 Persistent Storage

Stateful components such as MySQL require persistent storage.

The Kubernetes storage flow is:

```text
MySQL Pod
    │
    ▼
Persistent Volume Claim
    │
    ▼
Persistent Volume
    │
    ▼
Persistent Storage
```

Persistent storage allows database data to survive pod recreation according to the configured Kubernetes storage and reclaim policies.

> Deleting persistent volumes or using commands that remove volumes can result in database data loss. Always verify the storage resources before performing cleanup.

---

# 🩺 Troubleshooting

## MySQL Connection Failed

Check:

- MySQL pod/container is running.
- Database name is correct.
- Username and password are correct.
- Port is correct.
- Kubernetes applications use the MySQL Service name instead of `localhost`.

For Kubernetes, the database host should normally be the configured Service name, such as:

```text
mysql-db
```

---

## RabbitMQ Connection Failed

Check:

```bash
kubectl get pods
kubectl get svc
```

For Kubernetes, use the RabbitMQ Service name configured in the manifests, commonly:

```text
rabbitmq
```

---

## Notification List Is Empty

Check the complete event path:

```text
Order Service
     ↓
RabbitMQ
     ↓
order.completed.queue
     ↓
Notification Service
     ↓
Notification Database
```

Then inspect:

```bash
kubectl logs deployment/order-service
kubectl logs deployment/notification-service
```

RabbitMQ:

```bash
kubectl exec -it <rabbitmq-pod> -- rabbitmqctl list_queues
kubectl exec -it <rabbitmq-pod> -- rabbitmqctl list_bindings
```

---

## Pod Is Not Running

```bash
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

Common causes:

- Image does not exist.
- Incorrect image name.
- Database unavailable.
- RabbitMQ unavailable.
- Incorrect environment variable.
- Incorrect Kubernetes Service name.
- Incorrect Secret.
- Incorrect ConfigMap.

---

## ImagePullBackOff

Check:

```bash
kubectl describe pod <pod-name>
docker images
```

Make sure the image name in the Kubernetes Deployment exactly matches the image that was built.

If using Minikube's Docker daemon, make sure the images were built after running the appropriate `minikube docker-env` command.

---

## CrashLoopBackOff

Run:

```bash
kubectl logs <pod-name>
kubectl logs <pod-name> --previous
kubectl describe pod <pod-name>
```

Look for database connection errors, configuration errors, missing environment variables, or application startup exceptions.

---

## Gateway Returns 404

Check:

```bash
kubectl get pods
kubectl get svc
```

Verify that the Gateway route configuration matches the requested path and that the target service is running.

If Actuator is enabled, check:

```text
http://localhost:8080/actuator
```

---

## Frontend Cannot Reach Backend

First test the Gateway directly:

```text
http://localhost:8080/cakes
```

If the Gateway works but the frontend does not, verify:

- Frontend API base URL.
- Gateway port-forward.
- Frontend port-forward.
- CORS configuration.
- Kubernetes Service names.

---

# ⚠️ Important Kubernetes Notes

## Do Not Use `localhost` Between Kubernetes Pods

Inside Kubernetes, services should communicate using Kubernetes Service names.

Examples:

```text
mysql-db
rabbitmq
catalog-service
order-service
rating-service
notification-service
```

Do not use:

```text
localhost
```

for communication from one Kubernetes pod to another.

`localhost` refers to the current pod/container.

---

## Frontend and Gateway Port Forwarding

For the Minikube testing procedure in this README, keep both commands running:

```bash
kubectl port-forward svc/frontend 8085:3000
```

and:

```bash
kubectl port-forward svc/api-gateway 8080:8080
```

Then access:

```text
http://localhost:8085
```

---

# 🛑 Stopping the Application

## Docker Compose

From the `docker` directory:

```bash
docker compose down
```

To remove containers, networks, and Compose-managed volumes:

```bash
docker compose down -v
```

> Use `-v` carefully because it can remove persisted database data.

## Kubernetes

To remove the Kubernetes resources:

```bash
kubectl delete -R -f kubernetes/
```

Alternatively, delete specific resource groups individually if you want more control.

> Be careful when deleting infrastructure and persistent storage resources because they may contain database data.

## Stop Minikube

```bash
minikube stop
```

To delete the Minikube cluster completely:

```bash
minikube delete
```

> `minikube delete` removes the cluster and its local cluster data.

---

# 📊 Deployment Strategy

CakeDelight follows a progressive deployment strategy:

```text
Stage 1
Local Development
       │
       ▼
Stage 2
Docker Compose
       │
       ▼
Stage 3
Kubernetes / Minikube
```

This allows the application to be developed and tested locally before being containerized and finally deployed as a Kubernetes-based cloud-native system.

---

# 🎯 Learning Objectives Demonstrated

## Microservices

- Independent services
- Service boundaries
- REST APIs
- Inter-service communication

## Spring Boot

- REST Controllers
- Service layer
- Repository layer
- JPA/Hibernate
- Dependency Injection
- Configuration

## API Gateway

- Centralized routing
- Single backend entry point
- CORS handling

## Messaging

- RabbitMQ
- Exchanges
- Queues
- Routing keys
- Event-driven communication

## Databases

- MySQL
- JPA/Hibernate
- Database-per-Service
- Persistent storage

## Docker

- Docker images
- Containerization
- Docker Compose

## Kubernetes

- Pods
- Deployments
- Services
- ConfigMaps
- Secrets
- Persistent Volumes
- Persistent Volume Claims
- Minikube

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Component-based UI

---

# 🚀 Future Improvements

Possible future improvements include:

- JWT authentication and authorization
- Customer registration/login
- Admin dashboard
- Payment integration
- Email notifications
- SMS notifications
- Product image storage
- Centralized logging
- Distributed tracing
- Circuit breaker with Resilience4j
- Swagger/OpenAPI documentation
- Automated unit and integration tests
- CI/CD pipeline
- Kubernetes Horizontal Pod Autoscaling
- Prometheus and Grafana monitoring
- Production-grade secret management
- Cloud deployment

---

# 👨‍💻 Author

**Najim Tamboli**

CakeDelight was developed as an **Accenture Cloud Native Microservices Engineering Capstone Project**.

---

# 📄 License

This project is intended for educational and capstone project purposes.

---

# ⭐ Project Summary

CakeDelight combines:

```text
React
  +
Spring Boot Microservices
  +
Spring Cloud Gateway
  +
MySQL
  +
RabbitMQ
  +
Docker
  +
Kubernetes
```

into a complete cloud-native cake ordering application.

The project demonstrates the progression:

```text
Development
     ↓
Spring Boot Microservices
     ↓
REST APIs
     ↓
API Gateway
     ↓
RabbitMQ
     ↓
MySQL
     ↓
Docker
     ↓
Kubernetes / Minikube
     ↓
Cloud-Native Application
```

**CakeDelight — From local microservices to a containerized Kubernetes deployment. 🍰☁️**
