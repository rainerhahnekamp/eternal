package com.softarc.eternal.web;

import com.softarc.eternal.web.api.BookingsApi;
import com.softarc.eternal.web.model.Booking;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

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
