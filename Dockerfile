FROM openjdk:11.0.10-slim

CMD ./mvnw spring-boot:run -pl eternal-backend
