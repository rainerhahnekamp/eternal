package com.softarc.eternal.holiday.web.mapping;

import com.softarc.eternal.holiday.domain.Holiday;
import com.softarc.eternal.holiday.web.response.HolidayResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface HolidayMapper {
  @Mapping(target = "hasCover", expression = "java(holiday.getCoverPath().isPresent())")
  HolidayResponse holidayToResponse(Holiday holiday);
}
