package com.cakedelight.rating.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long cakeId;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private Integer score; // e.g., 1 to 5 stars

    @Column(length = 500)
    private String comment;

    private LocalDateTime createdAt;
}