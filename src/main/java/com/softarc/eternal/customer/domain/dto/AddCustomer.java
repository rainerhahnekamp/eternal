package com.softarc.eternal.customer.domain.dto;

import jakarta.validation.constraints.NotBlank;

public record AddCustomer(@NotBlank String firstname, @NotBlank String name) {}
