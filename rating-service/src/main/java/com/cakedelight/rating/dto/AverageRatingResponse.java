package com.cakedelight.rating.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AverageRatingResponse {
    private Long cakeId;
    private Double averageScore;
    private Long totalRatings;
}