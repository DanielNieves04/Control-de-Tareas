# Etapa 1: Build
FROM maven:3.9.4-eclipse-temurin-17 AS builder

WORKDIR /app

COPY controlDeTareasBackend/pom.xml .
COPY controlDeTareasBackend/src ./src
RUN mvn clean package -DskipTests \
    && ls -lh /app/target

# Etapa 2: Runtime
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar
# Antes de arrancar, imprime también el classpath y las vars:
ENV JAVA_TOOL_OPTIONS="-verbose:class -Dspring.profiles.active=prod"
ENTRYPOINT ["sh", "-c", "echo \"JAR in /app:\" && ls -lh /app && echo \"Env vars:\" && env | grep SPRING && java -jar app.jar"]
