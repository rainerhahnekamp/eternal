package com.rh.eternal.db.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity()
@Data
@Table(name = "Holiday")
public class HolidayEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String title;
  private String teaser;
  private String description;
  private String imageUrl;
  private Long typeId;
  private Integer durationInDays;
  private Integer minCount;
  private Integer maxCount;
  private Boolean onSale;
  private Boolean soldOut;
}
