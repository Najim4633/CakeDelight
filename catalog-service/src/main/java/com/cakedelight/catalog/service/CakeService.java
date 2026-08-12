package com.cakedelight.catalog.service;

import com.cakedelight.catalog.dto.CakeRequest;
import com.cakedelight.catalog.dto.CakeResponse;
import java.math.BigDecimal;
import java.util.List;

public interface CakeService {
    CakeResponse createCake(CakeRequest request);
    CakeResponse getCakeById(Long id);
    List<CakeResponse> getAllCakes(String name, String category, BigDecimal minPrice, BigDecimal maxPrice);
    CakeResponse updateCake(Long id, CakeRequest request);
    void deleteCake(Long id);
}