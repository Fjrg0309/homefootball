# Usar el JAR pre-compilado para evitar problemas de red en Docker
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/homefootball-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
