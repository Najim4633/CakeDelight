package com.cakedelight.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private Long cakeId;
    private String cakeName;
    private Integer quantity;
    private BigDecimal price;
}