# DTOs

An endpoint should be able to consume a complete `Holiday` object. For that we need to access it via a `POST` or `PUT` body and we only want to use a subset of the original `Holiday`.

For that purpose, create a `HolidayDto` record which only contains `id`, `name`, `description`. `HolidaysController` is repsonsible to map `Holiday` to `HolidayDto`. Make sure that `name` and `description` are required.

Create another record, called `HolidayResponse` which the endpoint uses for its answer. In the beginning, it should have the same properties as the `HolidayDto`.

# DTOs

- Come up with DTOs and update the frontend code as well. Use HolidayDto, HolidayResponse
- GlobalAdvice and Explain Problem Http
- Caching
- JSONView
- WebTest

# WebTest with MvcClient

# OpenAPI & Integration

- Install OpenAPI
- Checkout the Swagger UI
- Generate the Frontend Module
- Add Bean Validation (HolidayDto and Holiday)
- Update the Frontend (HolidaysRepository and tsconfig.base)
- Change the type holiday in the frontend and verify it is failing
- Change the type url in the backend and verify it is failing (two times via TypeScript compiler but also via the WebTests)
- Add Annotations
- Data Type Mapping (Numbers, Enums, HolidayTrip)
-

# Upload and Download

- Upload
- OpenApi Anpassung
- Optional
- Fix Tests
-
- File Type Check
- Serving Files
-
- Progress
- Quota Check

# Further Exercises

- Static Serving of Files
- Filters (LoggingFilter)
- Cookies
- ResponseEntity
