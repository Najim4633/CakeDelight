package com.cakedelight.rating.service;

import com.cakedelight.rating.dto.AverageRatingResponse;
import com.cakedelight.rating.dto.RatingRequest;
import com.cakedelight.rating.dto.RatingResponse;
import com.cakedelight.rating.entity.Rating;
import com.cakedelight.rating.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;

    @Override
    public RatingResponse submitRating(RatingRequest request) {
        Rating rating = Rating.builder()
                .cakeId(request.getCakeId())
                .userEmail(request.getUserEmail())
                .score(request.getScore())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        return mapToResponse(ratingRepository.save(rating));
    }

    @Override
    public List<RatingResponse> getRatingsByCakeId(Long cakeId) {
        return ratingRepository.findByCakeId(cakeId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AverageRatingResponse getAverageRating(Long cakeId) {
        List<Rating> ratings = ratingRepository.findByCakeId(cakeId);
        Double avg = ratingRepository.findAverageScoreByCakeId(cakeId);

        return AverageRatingResponse.builder()
                .cakeId(cakeId)
                .averageScore(avg != null ? avg : 0.0)
                .totalRatings((long) ratings.size())
                .build();
    }

    private RatingResponse mapToResponse(Rating rating) {
        return RatingResponse.builder()
                .id(rating.getId())
                .cakeId(rating.getCakeId())
                .userEmail(rating.getUserEmail())
                .score(rating.getScore())
                .comment(rating.getComment())
                .createdAt(rating.getCreatedAt())
                .build();
    }
}