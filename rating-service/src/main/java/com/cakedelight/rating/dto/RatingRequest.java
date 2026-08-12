package com.cakedelight.rating.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingRequest {

    @NotNull(message = "Cake ID is mandatory")
    private Long cakeId;

    @NotBlank(message = "User email is mandatory")
    @Email(message = "Invalid email format")
    private String userEmail;

    @NotNull(message = "Score is mandatory")
    @Min(value = 1, message = "Score must be at least 1")
    @Max(value = 5, message = "Score must not exceed 5")
    private Integer score;

    private String comment;
}