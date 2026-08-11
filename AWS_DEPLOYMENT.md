# AWS-Deployment-Plan

## Empfohlene Architektur

- Frontend: S3 + CloudFront
  - Sehr günstig, kein Serverbetrieb
  - Ideal für eine statische Vite-App
- Backend: AWS App Runner oder ECS Fargate
  - App Runner ist für kleine bis mittlere APIs meist am einfachsten und kostengünstig
  - Backend läuft in einem Docker-Container

## Frontend

1. Build lokal:
   - `npm install`
   - `VITE_API_BASE_URL=https://api.example.com npm run build`
2. Docker-Image bauen:
   - `docker build --build-arg VITE_API_BASE_URL=https://api.example.com -t cookinoshop-frontend .`
3. Optional: lokal testen
   - `docker run -p 8080:80 cookinoshop-frontend`

## Backend

- Das Backend-Repository sollte seinen eigenen Dockerfile haben
- In AWS App Runner:
  - Container-Image aus ECR auswählen
  - Port auf den Backend-Port setzen (z. B. 8000)
  - Umgebungsvariablen wie `DATABASE_URL`, `OPENAI_API_KEY` etc. konfigurieren

## Verbindung Frontend ↔ Backend

- Das Frontend verwendet `VITE_API_BASE_URL` für die API-URL
- Beispiel:
  - `VITE_API_BASE_URL=https://api.example.com`
- Wenn die API unter derselben Domain läuft, kann man auch `https://api.example.com` oder `https://example.com/api` verwenden

## Kostengünstigste Variante

- Frontend: S3 + CloudFront
- Backend: App Runner (pay-per-use)
- Domain: Route 53 + CloudFront
- Optional: verwende einen einzigen AWS Account und einen einzigen Container-Registry-Flow über ECR

## Nächster Schritt

- Backend zuerst in App Runner deployen
- Dann die finale API-URL im Frontend setzen und das Frontend auf S3 + CloudFront veröffentlichen
