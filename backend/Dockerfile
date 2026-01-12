# ==================== ETAPA 1: BUILD ====================
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /build

# Copiar archivos de configuración de Maven
COPY pom.xml .

# Descargar dependencias (se cachea esta capa si pom.xml no cambia)
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Compilar el proyecto
RUN mvn clean package -DskipTests -B

# ==================== ETAPA 2: RUNTIME ====================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiar el JAR compilado desde la etapa de build
COPY --from=build /build/target/homefootball-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
