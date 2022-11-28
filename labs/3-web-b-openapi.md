- [1. OpenAPI UI](#1-openapi-ui)
- [2. Code Generator](#2-code-generator)
- [3. Customize method and service names](#3-customize-method-and-service-names)
- [4. Datatype Mapping](#4-datatype-mapping)


The solution branch for the whole lab is `solution-3-1-basics`.

In this - short - exercise, we are going to setup OpenAPI, its UI and its code generator.

# 1. OpenAPI UI

Install SpringDoc by adding its dependency to **build.gradle**

```groovy
dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-validation'
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