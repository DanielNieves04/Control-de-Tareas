# Etapa 1: Build
FROM maven:3.9.4-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar solo los archivos necesarios desde la subcarpeta controlDeTareasBackend
COPY controlDeTareasBackend/pom.xml .
COPY controlDeTareasBackend/src ./src

RUN mvn clean package -DskipTests

# Etapa 2: Runtime
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
