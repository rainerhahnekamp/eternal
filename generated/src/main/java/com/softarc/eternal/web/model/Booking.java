package com.softarc.eternal.web.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * Booking
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2023-07-19T22:46:46.568931+02:00[Europe/Vienna]")
public class Booking {

  private Long id;

  private Long holidayTripId;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private LocalDate bookingDate;

  private String comment;

  /**
   * Default constructor
   * @deprecated Use {@link Booking#Booking(Long, LocalDate)}
   */
  @Deprecated
  public Booking() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public Booking(Long holidayTripId, LocalDate bookingDate) {
    this.holidayTripId = holidayTripId;
    this.bookingDate = bookingDate;
  }

  public Booking id(Long id) {
    this.id = id;
    return this;
  }

  /**
   * Get id
   * @return id
  */
  
  @JsonProperty("id")
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Booking holidayTripId(Long holidayTripId) {
    this.holidayTripId = holidayTripId;
    return this;
  }

  /**
   * Get holidayTripId
   * @return holidayTripId
  */
  @NotNull 
  @JsonProperty("holidayTripId")
  public Long getHolidayTripId() {
    return holidayTripId;
  }

  public void setHolidayTripId(Long holidayTripId) {
    this.holidayTripId = holidayTripId;
  }

  public Booking bookingDate(LocalDate bookingDate) {
    this.bookingDate = bookingDate;
    return this;
  }

  /**
   * Get bookingDate
   * @return bookingDate
  */
  @NotNull @Valid 
  @JsonProperty("bookingDate")
  public LocalDate getBookingDate() {
    return bookingDate;
  }

  public void setBookingDate(LocalDate bookingDate) {
    this.bookingDate = bookingDate;
  }

  public Booking comment(String comment) {
    this.comment = comment;
    return this;
  }

  /**
   * Get comment
   * @return comment
  */
  
  @JsonProperty("comment")
  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Booking booking = (Booking) o;
    return Objects.equals(this.id, booking.id) &&
        Objects.equals(this.holidayTripId, booking.holidayTripId) &&
        Objects.equals(this.bookingDate, booking.bookingDate) &&
        Objects.equals(this.comment, booking.comment);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, holidayTripId, bookingDate, comment);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Booking {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    holidayTripId: ").append(toIndentedString(holidayTripId)).append("\n");
    sb.append("    bookingDate: ").append(toIndentedString(bookingDate)).append("\n");
    sb.append("    comment: ").append(toIndentedString(comment)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

