package com.cakedelight.order.client;

import lombok.Data;

@Data
public class CakeDTO {
    private Long id;
    private String name;
    private Double price;
    private Boolean available;
}