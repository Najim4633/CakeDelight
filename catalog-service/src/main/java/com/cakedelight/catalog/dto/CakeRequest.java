package com.cakedelight.catalog.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CakeRequest {
    @NotBlank(message = "Cake name is mandatory")
    private String name;

    private String description;

    @NotBlank(message = "Category is mandatory")
    private String category;

    @NotNull(message = "Price is mandatory")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Availability status is mandatory")
    private Boolean isAvailable;

    private String imageUrl;
}