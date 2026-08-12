package com.cakedelight.rating.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {
    private Long id;
    private Long cakeId;
    private String userEmail;
    private Integer score;
    private String comment;
    private LocalDateTime createdAt;
}