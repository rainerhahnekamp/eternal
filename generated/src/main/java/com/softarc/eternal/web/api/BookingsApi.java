/**
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech) (6.6.0).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
package com.softarc.eternal.web.api;

import com.softarc.eternal.web.model.Booking;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import jakarta.annotation.Generated;

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2023-07-19T22:46:46.568931+02:00[Europe/Vienna]")
@Validated
public interface BookingsApi {

    default Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    /**
     * POST /api/booking
     *
     * @param booking  (required)
     * @return OK (status code 200)
     */
    @RequestMapping(
        method = RequestMethod.POST,
        value = "/api/booking",
        produces = { "application/json" },
        consumes = { "application/json" }
    )
    default ResponseEntity<Boolean> add(
         @Valid @RequestBody Booking booking
    ) {
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }


    /**
     * GET /api/booking
     *
     * @return OK (status code 200)
     */
    @RequestMapping(
        method = RequestMethod.GET,
        value = "/api/booking",
        produces = { "application/json" }
    )
    default ResponseEntity<List<Booking>> findAll(
        
    ) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "[ { \"holidayTripId\" : 6, \"bookingDate\" : \"2000-01-23\", \"comment\" : \"comment\", \"id\" : 0 }, { \"holidayTripId\" : 6, \"bookingDate\" : \"2000-01-23\", \"comment\" : \"comment\", \"id\" : 0 } ]";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }


    /**
     * GET /api/booking/{id}
     *
     * @param id  (required)
     * @return OK (status code 200)
     */
    @RequestMapping(
        method = RequestMethod.GET,
        value = "/api/booking/{id}",
        produces = { "application/json" }
    )
    default ResponseEntity<Booking> findById(
         @PathVariable("id") Long id
    ) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"holidayTripId\" : 6, \"bookingDate\" : \"2000-01-23\", \"comment\" : \"comment\", \"id\" : 0 }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }


    /**
     * DELETE /api/booking/{id}
     *
     * @param id  (required)
     * @return OK (status code 200)
     */
    @RequestMapping(
        method = RequestMethod.DELETE,
        value = "/api/booking/{id}"
    )
    default ResponseEntity<Void> remove(
         @PathVariable("id") Long id
    ) {
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }


    /**
     * PUT /api/booking
     *
     * @param booking  (required)
     * @return OK (status code 200)
     */
    @RequestMapping(
        method = RequestMethod.PUT,
        value = "/api/booking",
        consumes = { "application/json" }
    )
    default ResponseEntity<Void> save(
         @Valid @RequestBody Booking booking
    ) {
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

}