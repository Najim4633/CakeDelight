# Stage 1: Build the application using Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the pom.xml and download dependencies first (optimizes Docker caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the JAR (skipping tests for speed)
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the lightweight production image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy only the compiled JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Start the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]