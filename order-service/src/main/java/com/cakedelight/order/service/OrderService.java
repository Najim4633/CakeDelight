package com.cakedelight.order.service;

import com.cakedelight.order.dto.OrderRequest;
import com.cakedelight.order.dto.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createBasket(OrderRequest request);
    OrderResponse getOrderById(Long id);
    List<OrderResponse> getOrdersByCustomer(String email);
    OrderResponse updateBasket(Long id, OrderRequest request);
    OrderResponse checkout(Long id);
}