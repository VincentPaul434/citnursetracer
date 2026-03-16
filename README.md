# Nursing Alumni Tracer - Submission Hub Scaffold

This project now includes core infrastructure and a first vertical slice for survey submission initialization.

## What is implemented

- Feature-first packages under `com.alumni.tracer`
- Core infrastructure:
  - `BaseEntity` with JPA auditing timestamps
  - `SecurityConfig` with stateless `SecurityFilterChain`, CORS, and public submission route
  - `JwtUtils` for RS256 token generation/validation
- Submission feature:
  - `SurveySubmission` JPA entity
  - `SurveySubmissionRepository`
  - `SubmissionService` to initialize/reuse a submission and return a token
  - `SubmissionController` with `POST /api/v1/submissions/init`

## Quick try

```bash
cp .env.example .env
./mvnw test
./mvnw spring-boot:run
```

Example request:

```bash
curl -X POST http://localhost:8080/api/v1/submissions/init \
  -H 'Content-Type: application/json' \
  -d '{"email":"nurse@example.com","hasAcceptedPrivacy":true}'
```

## Notes

- Configure secrets in `.env` (local only, git-ignored) or environment variables.
- Commit `.env.example` only with placeholder values.
- For production, set `APP_JWT_PRIVATE_KEY` and `APP_JWT_PUBLIC_KEY`.
- If JWT keys are not configured, the app generates an ephemeral RSA key pair at startup.
- Future feature entities should use `@OneToOne(optional = false)` to `SurveySubmission` to enforce parent linkage.
