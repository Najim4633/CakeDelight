package com.cakedelight.catalog.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cakes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable;

    @Column(name = "image_url")
    private String imageUrl;
}