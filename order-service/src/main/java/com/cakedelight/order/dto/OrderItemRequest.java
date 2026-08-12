package com.cakedelight.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequest {
    @NotNull(message = "Cake ID is mandatory")
    private Long cakeId;

    @NotBlank(message = "Cake name is mandatory")
    private String cakeName;

    @NotNull(message = "Quantity is mandatory")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Price is mandatory")
    private BigDecimal price;
}