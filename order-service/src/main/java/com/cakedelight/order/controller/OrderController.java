package com.cakedelight.order.controller;

import com.cakedelight.order.dto.OrderRequest;
import com.cakedelight.order.dto.OrderResponse;
import com.cakedelight.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createBasket(@Valid @RequestBody OrderRequest request) {
        log.info("Creating new basket for customer: {}", request.getCustomerEmail());
        return new ResponseEntity<>(orderService.createBasket(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        log.info("Fetching order with ID: {}", id);
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/customer/{email}")
    public ResponseEntity<List<OrderResponse>> getOrdersByCustomer(@PathVariable String email) {
        log.info("Fetching orders for customer: {}", email);
        return ResponseEntity.ok(orderService.getOrdersByCustomer(email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponse> updateBasket(@PathVariable Long id, @Valid @RequestBody OrderRequest request) {
        log.info("Updating basket for order ID: {}", id);
        return ResponseEntity.ok(orderService.updateBasket(id, request));
    }

    @PostMapping("/{id}/checkout")
    public ResponseEntity<OrderResponse> checkout(@PathVariable Long id) {
        log.info("Processing checkout for order ID: {}", id);
        return ResponseEntity.ok(orderService.checkout(id));
    }
}