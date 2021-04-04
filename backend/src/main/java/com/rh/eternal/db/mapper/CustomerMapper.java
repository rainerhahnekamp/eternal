package com.rh.eternal.db.mapper;

import com.rh.eternal.db.entity.CustomerEntity;
import com.rh.eternal.domain.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CustomerMapper {
  CustomerMapper INSTANCE = Mappers.getMapper(CustomerMapper.class);

  @Mapping(target = "id", ignore = true)
  void merge(CustomerEntity customer, @MappingTarget CustomerEntity entity);

  CustomerEntity mapToEntity(Customer customer);

  Customer mapFromEntity(CustomerEntity customerEntity);
}
