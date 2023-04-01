- [1. Uploading Files](#1-uploading-files)
  - [1.1. Controller \& Models](#11-controller--models)
  - [1.2. Tests](#12-tests)
  - [1.3. Update UI](#13-update-ui)
- [2. Downloading/Viewing Files](#2-downloadingviewing-files)
  - [2.1. Endpoint](#21-endpoint)
  - [2.2. `HolidaysResponse`](#22-holidaysresponse)
- [Bonus](#bonus)
  - [Quota](#quota)
  - [Image Type Recognition](#image-type-recognition)


# 1. Uploading Files

The solution branch for this exercise is `solution-3-3-upload-download-1-basic`.

## 1.1. Controller & Models


We want to be able to upload a cover image for every holiday.

Add the property `Optional<string> coverPath` to `Holiday`. The methods `add` and `update` of `HolidaysRepository` should get a further parameter `Optional<String> cover`.

---

`HolidaysController` should be able to receive a file via the `POST` and `PUT` methods. You'll have to set `consumes` property in `[Post|Put]Mapping` to `MediaType.MULTIPART_FORM_DATA_VALUE`.

Since the endpoint gets both `HolidayDto` and the file of the cover in one request, you'll have to use `@RequestPart` to access them individually.

The controller should also move the file into the directory **/filestore**.

<details>
<summary>Show Solution</summary>
<p>

**HolidaysController.java**

```java
public class HolidaysController {

  //...

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(operationId = "add")
  public boolean add(
    @RequestPart @Valid HolidayDto holidayDto,
    @RequestPart MultipartFile cover
  ) throws IOException {
    var filename = cover.getOriginalFilename();
    var path = Path.of("", "filestore", filename);
    this.repository.add(
        holidayDto.name(),
        holidayDto.description(),
        Optional.ofNullable(filename)
      );
    cover.transferTo(path);
    return true;
  }

  @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(operationId = "save")
  public void update(
    @RequestPart @Valid HolidayDto holidayDto,
    @RequestPart MultipartFile cover
  ) throws IOException {
    var filename = cover.getOriginalFilename();
    this.repository.update(
        holidayDto.id(),
        holidayDto.name(),
        holidayDto.description(),
        Optional.ofNullable(filename)
      );
    var path = Path.of("", "filestore", filename);
    cover.transferTo(path);
  }
}

```

</p>
</details>

## 1.2. Tests

Modify your tests as well.

The unit test needs to come up with a mock of the `MultipartFile`

The integration test should use the **/src/test/resources/vienna.jpg** to upload a real image and should verify that it is actually stored in **/filestore**. You can use the `MultipartBodyBuilder` to add the `HolidayDto` and the file. Make sure you also set the content type to `MediaType.MULTIPART_FORM_DATA`.

<details>
<summary>Show Solution</summary>
<p>

**HolidaysControllerUnitTest.java**

```java
@WebMvcTest(HolidaysController.class)
public class HolidaysControllerUnitTest {

  // ...

  @Test
  public void testRepositoryIsCalled() throws IOException {
    MultipartFile cover = mock(MultipartFile.class);
    when(cover.getOriginalFilename()).thenReturn("vienna.jpg");
    var vienna = new HolidayDto(1L, "Vienna", "Urlaub in Wien");

    controller.add(vienna, cover);
    verify(repository)
      .add("Vienna", "Urlaub in Wien", Optional.of("vienna.jpg"));
  }
}

```

**HolidaysControllerIntegrationTest.java**

```java
@AutoConfigureMockMvc
class HolidaysControllerIntegrationTest {

  private static final Path destinationPath = Path.of(
    "",
    "filestore",
    "vienna.jpg"
  );

  @Autowired
  HolidaysController controller;

  @Autowired
  HolidaysRepository repository;

  @Autowired
  WebTestClient webTestClient;

  @AfterEach
  void removeViennaFile() throws IOException {
    if (Files.exists(destinationPath)) {
      Files.delete(destinationPath);
    }
  }

  @Test
  public void testInjectedDefaultRepository() {
    assertThat(repository).isInstanceOf(DefaultHolidaysRepository.class);
  }

  @Test
  public void testAddHoliday() {
    var holidayFile = new ClassPathResource("vienna.jpg");
    MultipartBodyBuilder builder = new MultipartBodyBuilder();
    builder.part("cover", holidayFile);
    var amsterdam = new HolidayDto(1L, "Amsterdam", "Netherlands");
    builder.part("holidayDto", amsterdam);

    webTestClient
      .post()
      .uri("/api/holidays")
      .contentType(MediaType.MULTIPART_FORM_DATA)
      .bodyValue(builder.build())
      .exchange()
      .expectStatus()
      .isOk();
    webTestClient
      .get()
      .uri("/api/holidays")
      .exchange()
      .expectBody()
      .jsonPath("[0].name")
      .isEqualTo("Amsterdam");

    assertThat(Files.exists(destinationPath)).isTrue();
  }

  @Test
  public void testAddHolidayIsValidated() {
    var holidayFile = new ClassPathResource("vienna.jpg");
    MultipartBodyBuilder builder = new MultipartBodyBuilder();
    builder.part("cover", holidayFile);
    var amsterdam = new HolidayDto(1L, "Amsterdam", "");
    builder.part("holidayDto", amsterdam);

    webTestClient
      .post()
      .uri("/api/holidays")
      .bodyValue(amsterdam)
      .exchange()
      .expectStatus()
      .isEqualTo(415);
  }
}

```

</p>
</details>

## 1.3. Update UI

Finally, update the UI so that your user can actually upload a cover. First, update your openapi module by re-running the code generator.

You can use the upload field component in **holiday-detail.component.ts** by adding `{ key: 'cover', type: 'file' }` to it. This will add a `cover` property to your `FormGroup` which contains already the file.

If you're short on time - or don't want to deal too much with Angular in a Spring workshop - merge from the solution branch.

# 2. Downloading/Viewing Files


The solution branch for this exercise is `solution-3-3-upload-download-2-download`.

## 2.1. Endpoint

Create a new endpoint `/api/holidays/{id}/cover` which returns the cover image of a `Holiday` according to its the path's `id`.

Try it out as well!

<details>
<summary>Show Solution</summary>
<p>

```java
  @GetMapping(
    value = "/{id}/cover",
    produces = MediaType.APPLICATION_OCTET_STREAM_VALUE
  )
  public ResponseEntity<Resource> viewCover(@PathVariable("id") Long id) {
    var holiday = this.repository.find(id).orElseThrow();
    var cover = holiday.getCoverPath().orElseThrow();
    var file = Path.of("", "filestore", cover);
    FileSystemResource resource = new FileSystemResource(file);
    return new ResponseEntity<>(resource, new HttpHeaders(), HttpStatus.OK);
  }

  private HolidayResponse toHolidayResponse(Holiday holiday) {
    return new HolidayResponse(
      holiday.getId(),
      holiday.getName(),
      holiday.getDescription(),
      holiday.getCoverPath().isPresent(),
      Collections.emptyList()
    );
  }
```
</p>
</details>

## 2.2. `HolidaysResponse`

Our frontend should show the image for a holiday if it actually has an image. As `src` attribute of the `<img>`, it should use the newly created endpoint.

Add the property `Boolean hasCover` to `HolidaysResponse`.

For the solution, lookup the solution branch.

# Bonus

The solution branch for this exercise is `solution-3-3-upload-download-3-misc`.

## Quota

Increase the maximum upload size of an image to 4MB. You can do that by setting two different application properties. Search on the Internet and then try it out via **/labs/images/large-file.jpg**.

<details>
<summary>Show Solution</summary>
<p>

**application.yml**

```yml

spring.servlet.multipart:
  max-file-size: 4MB
  max-request-size: 4MB
```
</p>
</details>

## Image Type Recognition

The library Tika is able to detect the type of a file. Even if it is missing or has the wrong extension.

Use it to assert that an uploaded cover is really of type image. If not, throw an exception.
