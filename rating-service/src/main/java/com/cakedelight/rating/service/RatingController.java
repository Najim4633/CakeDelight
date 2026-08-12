package com.cakedelight.rating.service;

import com.cakedelight.rating.dto.AverageRatingResponse;
import com.cakedelight.rating.dto.RatingRequest;
import com.cakedelight.rating.dto.RatingResponse;
import com.cakedelight.rating.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ratings")
@RequiredArgsConstructor
@Slf4j
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<RatingResponse> submitRating(@Valid @RequestBody RatingRequest request) {
        log.info("Submitting rating for cake ID: {}", request.getCakeId());
        return new ResponseEntity<>(ratingService.submitRating(request), HttpStatus.CREATED);
    }

    @GetMapping("/cake/{cakeId}")
    public ResponseEntity<List<RatingResponse>> getRatingsByCakeId(@PathVariable Long cakeId) {
        log.info("Fetching all ratings for cake ID: {}", cakeId);
        return ResponseEntity.ok(ratingService.getRatingsByCakeId(cakeId));
    }

    @GetMapping("/cake/{cakeId}/average")
    public ResponseEntity<AverageRatingResponse> getAverageRating(@PathVariable Long cakeId) {
        log.info("Calculating average rating for cake ID: {}", cakeId);
        return ResponseEntity.ok(ratingService.getAverageRating(cakeId));
    }
}