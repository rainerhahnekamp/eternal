When a new holiday is created, we want to inform our printing department to start the production of new brochures.

An API, powered by Spring Boot does already exist. It is located in the directory **/printing-service**.
Run it, and verify that it exposes an endpoint on _http://localhost:8081/api/print-brochure_.

As input, it expects a JSON structure `{holidayId: number, name: string, description: string}`.

For example in IntelliJ's services pane:

```shell
POST http://localhost:8081/api/order
Content-Type: application/json

{"id": 1, "name": "Detroit", "description": "This is a holiday in Detroit"}
```

If the `name` has the value "Graz", it will return a status code of 500.

In this lab, we communicate with the printing microservice in three different ways:

- synchronously via the `WebClient`
- synchronously via Feign
- asynchronously via RabbitMQ

# Preparation

First, add a new property `brochureStatus` to `Holiday`. It should be an enum type with following types

- none
- requested
- confirmed
- printed
- failed

Apply the `@Converter` approach to persist the `enum` and create the necessary `Flyway` migration.

# Native WebClient

Use the `WebClient` to send an order command to the printing service when a holiday is created. `WebClient` is part of the `org.springframework.boot:spring-boot-starter-webflux` dependency. You'll have to add it to your **build.gradle**.

The `WebClient` should be provided as bean from the `AppConfiguration`. For the instantiation, execute

```java
package com.softarc.eternal;

import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AppConfiguration {

  // ...

  @Bean
  public WebClient webClient() {
    return WebClient.create("http://localhost:8081");
  }
}

```

If the printing service returns a status code of 200, it should save the value `confirmed`, otherwise `failed`.

Update your test and include the failed use case well.

# Feign Client

# Message Broker
