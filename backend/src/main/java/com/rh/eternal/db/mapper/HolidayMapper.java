package com.rh.eternal.db.mapper;

import com.rh.eternal.db.entity.HolidayEntity;
import com.rh.eternal.domain.Holiday;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface HolidayMapper {
  HolidayMapper INSTANCE = Mappers.getMapper(HolidayMapper.class);

  HolidayEntity mapToEntity(Holiday holiday);

  Holiday mapFromEntity(HolidayEntity holidayEntity);
}
