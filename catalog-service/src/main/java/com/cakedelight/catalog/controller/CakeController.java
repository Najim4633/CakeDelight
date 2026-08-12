package com.cakedelight.catalog.controller;

import com.cakedelight.catalog.dto.CakeRequest;
import com.cakedelight.catalog.dto.CakeResponse;
import com.cakedelight.catalog.service.CakeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/cakes")
@RequiredArgsConstructor
@Slf4j
public class CakeController {

    private final CakeService cakeService;

    @PostMapping
    public ResponseEntity<CakeResponse> createCake(@Valid @RequestBody CakeRequest request) {
    	log.info("Received request to create a new cake: {}", request.getName());
        return new ResponseEntity<>(cakeService.createCake(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CakeResponse> getCakeById(@PathVariable Long id) {
    	log.info("Fetching cake with ID: {}", id);
        return ResponseEntity.ok(cakeService.getCakeById(id));
    }

    @GetMapping
    public ResponseEntity<List<CakeResponse>> getAllCakes(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
    	log.info("Fetching all cakes with filters - Category: {}, MinPrice: {}", category, minPrice);
        return ResponseEntity.ok(cakeService.getAllCakes(name, category, minPrice, maxPrice));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CakeResponse> updateCake(@PathVariable Long id, @Valid @RequestBody CakeRequest request) {
    	log.info("Received request to update a cake: {}", request.getName());
    	return ResponseEntity.ok(cakeService.updateCake(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCake(@PathVariable Long id) {
    	log.info("Received request to delete a cake with id: {}", id);
        cakeService.deleteCake(id);
        return ResponseEntity.noContent().build();
    }
}