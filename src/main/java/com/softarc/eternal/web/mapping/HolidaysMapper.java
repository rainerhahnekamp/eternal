package com.softarc.eternal.web.mapping;

import com.softarc.eternal.domain.Holiday;
import com.softarc.eternal.web.response.HolidayResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface HolidaysMapper {
  @Mapping(target = "description", source = "name")
  HolidayResponse holidayToResponse(Holiday holiday);
}
