package com.softarc.eternal.customer.web.mapping;

import com.softarc.eternal.customer.data.Customer;
import com.softarc.eternal.customer.domain.dto.AddCustomer;
import com.softarc.eternal.customer.web.request.AddCustomerRequest;
import com.softarc.eternal.customer.web.response.CustomerDto;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class CustomerMapper {
  @Mapping(target = "firstName", source = "firstname")
  @Mapping(target = "country", source = "country.name")
  public abstract CustomerDto toCustomerDto(Customer customer);


  @Mapping(target = "firstname", source = "firstName")
  @Mapping(target = "name", ignore = true)
  public abstract AddCustomer toAddCustomer(AddCustomerRequest addCustomerRequest);

  @AfterMapping
  public AddCustomer addName(AddCustomerRequest addCustomerRequest, @MappingTarget AddCustomer addCustomer) {
    return new AddCustomer(addCustomer.firstname(), addCustomerRequest.lastName());
  }
}
