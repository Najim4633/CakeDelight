package com.cakedelight.catalog.service;

import com.cakedelight.catalog.dto.CakeRequest;
import com.cakedelight.catalog.dto.CakeResponse;
import com.cakedelight.catalog.entity.Cake;
import com.cakedelight.catalog.exception.CakeNotFoundException;
import com.cakedelight.catalog.repository.CakeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CakeServiceImpl implements CakeService {

    private final CakeRepository cakeRepository;

    @Override
    public CakeResponse createCake(CakeRequest request) {
        Cake cake = mapToEntity(request);
        Cake savedCake = cakeRepository.save(cake);
        return mapToResponse(savedCake);
    }

    @Override
    public CakeResponse getCakeById(Long id) {
        Cake cake = cakeRepository.findById(id)
                .orElseThrow(() -> new CakeNotFoundException("Cake not found with ID: " + id));
        return mapToResponse(cake);
    }

    @Override
    public List<CakeResponse> getAllCakes(String name, String category, BigDecimal minPrice, BigDecimal maxPrice) {
        Specification<Cake> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (name != null && !name.isEmpty()) predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            if (category != null && !category.isEmpty()) predicates.add(cb.equal(cb.lower(root.get("category")), category.toLowerCase()));
            if (minPrice != null) predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            if (maxPrice != null) predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return cakeRepository.findAll(spec).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CakeResponse updateCake(Long id, CakeRequest request) {
        Cake cake = cakeRepository.findById(id)
                .orElseThrow(() -> new CakeNotFoundException("Cake not found with ID: " + id));
        
        cake.setName(request.getName());
        cake.setDescription(request.getDescription());
        cake.setCategory(request.getCategory());
        cake.setPrice(request.getPrice());
        cake.setIsAvailable(request.getIsAvailable());
        cake.setImageUrl(request.getImageUrl());
        
        return mapToResponse(cakeRepository.save(cake));
    }

    @Override
    public void deleteCake(Long id) {
        if (!cakeRepository.existsById(id)) {
            throw new CakeNotFoundException("Cake not found with ID: " + id);
        }
        cakeRepository.deleteById(id);
    }

    private Cake mapToEntity(CakeRequest request) {
        return Cake.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .isAvailable(request.getIsAvailable())
                .imageUrl(request.getImageUrl())
                .build();
    }

    private CakeResponse mapToResponse(Cake cake) {
        return CakeResponse.builder()
                .id(cake.getId())
                .name(cake.getName())
                .description(cake.getDescription())
                .category(cake.getCategory())
                .price(cake.getPrice())
                .isAvailable(cake.getIsAvailable())
                .imageUrl(cake.getImageUrl())
                .build();
    }
}