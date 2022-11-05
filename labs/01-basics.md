- [1. Create Domain Classes with Lombok support](#1-create-domain-classes-with-lombok-support)
- [2. Bean as Fake Repository](#2-bean-as-fake-repository)
- [3. Add a Controller](#3-add-a-controller)
- [4. Setup Logging](#4-setup-logging)
- [4. Setup and seed an embedded database (H2)](#4-setup-and-seed-an-embedded-database-h2)
- [5. Fetch Data via Database](#5-fetch-data-via-database)

# 1. Create Domain Classes with Lombok support

Create a new class `Holiday` under the package `com.softarc.eternal`.

It's should use Lombok's `@Data` annotation.

Register the dependencies for lombok in **build.gradle**. You have to add following entries under `dependencies`:

```groovy

```

# 2. Bean as Fake Repository

Create a bean which manages updates, deletions and inserts

# 3. Add a Controller

# 4. Setup Logging

Profiles
File Sink

# 4. Setup and seed an embedded database (H2)

Optionally, you can also use another database like MySQL.

# 5. Fetch Data via Database

