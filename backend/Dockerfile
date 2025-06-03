# Use an official JDK runtime as a parent image
FROM eclipse-temurin:17-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file (only after it's built locally or in CI)
COPY target/*.jar app.jar

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
