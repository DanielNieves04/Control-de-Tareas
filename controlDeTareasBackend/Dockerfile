# Etapa 1: Compilación
FROM maven:3.9.4-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar pom.xml y src primero para aprovechar la caché de Docker
COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Etapa 2: Runtime
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
