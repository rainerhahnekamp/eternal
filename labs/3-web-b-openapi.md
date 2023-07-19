- [1. OpenAPI UI](#1-openapi-ui)
- [2. Code Generator](#2-code-generator)
- [3. Customize method and service names](#3-customize-method-and-service-names)
- [4. Datatype Mapping](#4-datatype-mapping)
- [5. API First](#5-api-first)

The solution branch for the whole lab is `solution-3-1-basics`.

In this exercise, we are going to setup OpenAPI, its UI and its code generator.

# 1. OpenAPI UI

Install SpringDoc by adding its dependency to **build.gradle**

```groovy
dependencies {
  implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.1.0'
}
```

Now, restart Spring, open your browser and navigate to `http://localhost:8080/swagger-ui/index.html`.

You should see a colourful UI with all your endpoints. Your can call every endpoint by clicking on the button "Try it out". Play a little bit with it.

# 2. Code Generator

To generate the Angular module, you'll have to install the npm (there are also plugins for gradle, maven,...) module first.

Install it via `npx yarn add -D @openapitools/openapi-generator-cli`.

Now add a new script to your **package.json**:

```json
{
  "scripts": {
    // ...
    "openapi": "openapi-generator-cli generate -i http://localhost:8080/v3/api-docs -g typescript-angular -o libs/openapi"
  }
}
```

In **application.yml**, add the following entry:

```yml
springdoc:
  default-produces-media-type: application/json
```

Run the newly created script via `npm run openapi`. You should find a new directory **/libs/openapi**.

Register it as a new library in **/tsconfig.base.json**:

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    // ...
    "paths": {
      // ...
      "@eternal/openapi": ["libs/openapi/index.ts"]
    }
  }
}
```

Go to **/libs/openapi**. You should find there a file called **holidaysController.service.ts**.

Study it and then use it instead of the `HttpClient` in your **holidays-repository.service.ts**.

You can import it via

```typescript
import { HolidaysControllerService } from '@eternal/openapi';
```

# 3. Customize method and service names

We want to be able to control the names of our methods and classes that the OpenAPI code generator produces.

Use `@Operation` on methods and `@Tag` on the controller's class to set the names properly.

Regenerate the Angular module and verify that the Service has the new names.

<details>
<summary>Show Solution</summary>
<p>

**HolidaysController.java**

```java
// ...
@Tag(name = "Holidays")
public class HolidaysController {

  // ...
  @GetMapping
  @Operation(operationId = "findAll")
  public List<HolidayResponse> index() {
    // ...
  }

  @GetMapping("{id}")
  @Operation(operationId = "findById")
  public HolidayResponse find(@PathVariable("id") Long id) {
    // ...
  }

  @PostMapping
  @Operation(operationId = "add")
  public boolean add(@RequestBody @Valid HolidayDto holidayDto) {
    // ...
  }

  @PutMapping
  @Operation(operationId = "save")
  public void update(@RequestBody @Valid HolidayDto holidayDto) {
    // ...
  }

  @DeleteMapping("{id}")
  @Operation(operationId = "remove")
  public void remove(@PathVariable("id") Long id) {
    // ...
  }
}

```

</p>
</details>

# 4. Datatype Mapping

Add the property `List<HolidayTrip> trips` to `HolidayResponse`. In the controller, where `Holiday` is mapped to `HolidayResponse` use and empty list for the `trips`.

Regenerate the Angular module and check out the **holidayTrip.ts**. You should see that it generated `string` as type for `fromData` and `toDate`.

You can manipulate the type mapping via updating your generator script in the **package.json** to

```bash
openapi-generator-cli generate -i http://localhost:8080/v3/api-docs -g typescript-angular -o libs/openapi --type-mappings=DateTime=number
```

Now rerun the code generator and verify you get a `number` instead a `string`.

# 5. API First

Now we do the opposite. We create the spec first, and then generate the server stubs.

Create an OpenAPI speciciation file, which provides CRUD endpoints for a new domain `Booking`.

It should have the follwing endpoints. You don't need to implement them. It is just important that they respond with some dummy data.

- **GET, /api/bookings** returns all holidays
- **GET, /api/bookings/{id}**: returns holiday for the passed id or throws an error
- **POST, /api/bookings**: adds a new holiday with the passed name
- **POST, /api/bookings**: edits a given holiday
- **DELETE, /api/bookings/{id}**: removes the holiday with that particular id

We have just one model which is the `Booking` entity. It should have the following properties:

- `Long id`
- `Long holidayTripId`
- `Date bookingDate`
- `String comment`

To generate the yml file, take a look at the spec on https://swagger.io/specification/.

Also make sure, you make use of the integrated OpenAPI of IntelliJ.

Use the `spring` generator. You can find the configuration properties on https://openapi-generator.tech/docs/generators/spring/. Note, that there exists also a Gradle integration.

<details>
<summary>Show Solution</summary>
<p>

First, you need to create the **bookings.yml**.

**/api/bookings.yml**

```yml
openapi: 3.0.1
info:
  title: OpenAPI definition
  version: v0
servers:
  - url: http://localhost:8080
    description: Generated server url
paths:
  /api/booking:
    get:
      tags:
        - Bookings
      operationId: findAll
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Booking'
    put:
      tags:
        - Bookings
      operationId: save
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Booking'
        required: true
      responses:
        '200':
          description: OK
    post:
      tags:
        - Bookings
      operationId: add
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Booking'
        required: true
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: boolean
  /api/booking/{id}:
    get:
      tags:
        - Bookings
      operationId: findById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Booking'
    delete:
      tags:
        - Bookings
      operationId: remove
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: OK
components:
  schemas:
    Booking:
      required:
        - holidayTripId
        - bookingDate
      type: object
      properties:
        id:
          type: integer
          format: int64
        holidayTripId:
          type: integer
          format: int64
        bookingDate:
          type: string
          format: date
        comment:
          type: string
```

---

Next, install the OpenAPI Generator plugin in **build.gradle**. Add it to the `plugins` sections.

```groovy
plugins {
    id 'org.springframework.boot' version '3.1.1'
    id 'io.spring.dependency-management' version '1.1.0'
    id 'java'
    id 'org.openapi.generator' version '6.6.0'
}
```

---

After refreshing Gradle, you should see that there is category of tasks called **openapi tools**

Configure the task `openApiGenerate`:

```groovy
openApiGenerate {
  generatorName.set('spring')
  inputSpec.set("$rootDir/api/bookings.yml")
  outputDir.set("$rootDir/generated")
}
```

---

Running `./gradlew openApiGenerate` should create the **generated** directory. Unfortunately, the code is not usable. We have the implementations of the controllers, it uses `javax` annotation and other annotations, where we are missing the dependencies.

Change the configurator so that it uses the following properties:

```groovy
openApiGenerate {
  generatorName.set('spring')
  inputSpec.set("$rootDir/api/bookings.yml")
  outputDir.set("$rootDir/generated")
  additionalProperties.set([
    interfaceOnly: true,
    apiPackage: 'com.softarc.eternal.web.api',
    documentationProvider: 'none',
    modelPackage: 'com.softarc.eternal.web.model',
    openApiNullable: false,
    useSpringBoot3: true,
    useBeanValidation: true,
    useTags: true
  ])
}
```

---

Now we have to integrate the generated source into our `main` sourceset.

Add the following to your **build.gradle**.

```groovy
sourceSets.main.java.srcDirs += 'generated/src/main/java'
```

---

The generated code contains interfaces with default implemenation for our endpoints.

In order to "activate" them, we generate a class in our original sourceset which implements the methods of that interface.

It has to be annotated with `@RestController`. The other annotations are inherited.

**src/main/java/com/softarc/eternal/web/BookingsController.java**

```java
@RestController
public class BookingsController implements BookingsApi {

  @Override
  public ResponseEntity<List<Booking>> findAll() {
    return ResponseEntity.ok(Collections.emptyList());
  }

  @Override
  public ResponseEntity<Boolean> add(Booking booking) {
    return ResponseEntity.ok(true);
  }

  @Override
  public ResponseEntity<Booking> findById(Long id) {
    return ResponseEntity.ok(new Booking(id, LocalDate.now()));
  }

  @Override
  public ResponseEntity<Void> remove(Long id) {
    return ResponseEntity.ok().build();
  }

  @Override
  public ResponseEntity<Void> save(Booking booking) {
    return ResponseEntity.ok().build();
  }
}

```

---

Verify that `/api/booking/` responds and also shows up on http://localhost:8080/swagger-ui/index.html.

</p>
</details>
