# Etapa 1: Construcción
FROM eclipse-temurin:17-jdk-alpine as builder

WORKDIR /app

COPY ./pom.xml .
COPY ./mvnw .
COPY .mvn .mvn
COPY ./src ./src

RUN ./mvnw clean package -DskipTests

# Etapa 2: Ejecución
FROM eclipse-temurin:17-jdk-alpine

VOLUME /tmp

COPY --from=builder /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]