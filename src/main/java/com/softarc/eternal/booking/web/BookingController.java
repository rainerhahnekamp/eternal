package com.softarc.eternal.booking.web;


import com.softarc.eternal.booking.web.api.BookingApi;
import com.softarc.eternal.booking.web.model.Booking;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BookingController implements BookingApi {
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
