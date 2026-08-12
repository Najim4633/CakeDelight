package com.cakedelight.catalog.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CakeResponse {
    private Long id;
    private String name;
    private String description;
    private String category;
    private BigDecimal price;
    private Boolean isAvailable;
    private String imageUrl;
}