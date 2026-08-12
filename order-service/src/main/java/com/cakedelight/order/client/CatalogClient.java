package com.cakedelight.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "catalog-service",
        url = "${CATALOG_SERVICE_URL:http://localhost:8081}"
)
public interface CatalogClient {

    @GetMapping("/cakes/{id}")
    CakeDTO getCakeById(@PathVariable("id") Long id);
}