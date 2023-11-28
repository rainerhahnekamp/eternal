package com.softarc.eternal.customer.web.request;

import jakarta.validation.constraints.NotBlank;

public record AddCustomerRequest(@NotBlank(message = "This is required") String firstName, @NotBlank String lastName) {}
