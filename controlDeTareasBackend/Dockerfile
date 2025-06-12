# Etapa 1: Construcción
FROM eclipse-temurin:17-jdk-alpine as builder

WORKDIR /app

COPY .pom.xml .pom.xml
COPY .mvnw .mvnw
COPY .mvn .
COPY ./src .

RUN ./mvnw clean package -DskipTests

# Etapa 2: Ejecución
FROM eclipse-temurin:17-jdk-alpine

VOLUME /tmp

COPY --from=builder /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]