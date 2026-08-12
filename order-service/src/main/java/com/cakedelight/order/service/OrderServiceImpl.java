package com.cakedelight.order.service;

import com.cakedelight.order.config.RabbitMQConfig;
import com.cakedelight.order.dto.OrderItemRequest;
import com.cakedelight.order.dto.OrderItemResponse;
import com.cakedelight.order.dto.OrderRequest;
import com.cakedelight.order.dto.OrderResponse;
import com.cakedelight.order.entity.Order;
import com.cakedelight.order.entity.OrderItem;
import com.cakedelight.order.entity.OrderStatus;
import com.cakedelight.order.event.OrderCompletedEvent;
import com.cakedelight.order.exception.OrderNotFoundException;
import com.cakedelight.order.repository.OrderRepository;
import com.cakedelight.order.client.CatalogClient;
import com.cakedelight.order.client.CakeDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final RabbitTemplate rabbitTemplate; 
    private final CatalogClient catalogClient;

    @Override
    @Transactional
    public OrderResponse createBasket(OrderRequest request) {
        Order order = new Order();
        order.setCustomerEmail(request.getCustomerEmail());
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        
        mapItemsAndCalculateTotal(request, order);
        
        return mapToResponse(orderRepository.save(order));
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + id));
        return mapToResponse(order);
    }

    @Override
    public List<OrderResponse> getOrdersByCustomer(String email) {
        return orderRepository.findByCustomerEmail(email).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse updateBasket(Long id, OrderRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + id));
        
        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new IllegalStateException("Cannot update a completed order");
        }

        order.getItems().clear(); // Clear existing items
        mapItemsAndCalculateTotal(request, order); // Re-map and recalculate
        
        return mapToResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderResponse checkout(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + id));
        
        order.setStatus(OrderStatus.COMPLETED);
        Order savedOrder = orderRepository.save(order);
        
        // Build and publish the event to RabbitMQ
        OrderCompletedEvent event = OrderCompletedEvent.builder()
                .orderId(savedOrder.getId())
                .customerEmail(savedOrder.getCustomerEmail())
                .totalAmount(savedOrder.getTotalAmount())
                .completedAt(LocalDateTime.now())
                .build();
        
        try {
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.ORDER_EXCHANGE, 
                RabbitMQConfig.ORDER_ROUTING_KEY, 
                event
            );
            log.info("Published OrderCompletedEvent for Order ID: {}", savedOrder.getId());
        } catch (Exception e) {
        	 log.error("Failed to publish OrderCompletedEvent", e);
        	    throw e;
        }
        
        return mapToResponse(savedOrder);
    }

    private void mapItemsAndCalculateTotal(OrderRequest request, Order order) {
        BigDecimal total = BigDecimal.ZERO;
        
        for (OrderItemRequest itemRequest : request.getItems()) {
            
            // 1. Synchronous REST Call to Catalog Service
            CakeDTO catalogCake = catalogClient.getCakeById(itemRequest.getCakeId());
            
            // 2. Validate existence and availability
            if (catalogCake == null || Boolean.FALSE.equals(catalogCake.getAvailable())) {
                throw new RuntimeException("Cake with ID " + itemRequest.getCakeId() + " is unavailable or does not exist.");
            }

            // Convert the Double price from DTO into a strict BigDecimal for currency math
            BigDecimal securePrice = BigDecimal.valueOf(catalogCake.getPrice());
            
            // 3. Map items using TRUSTED data from the Catalog
            OrderItem item = OrderItem.builder()
                    .cakeId(catalogCake.getId())
                    .cakeName(catalogCake.getName()) 
                    .quantity(itemRequest.getQuantity())
                    .price(securePrice) // <-- Fixed: Now passing a BigDecimal
                    .order(order)
                    .build();
            
            order.getItems().add(item);
            
            // 4. Calculate using the secure price
            // <-- Fixed: Now multiplying two BigDecimals correctly
            BigDecimal itemTotal = securePrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            total = total.add(itemTotal);
        }
        
        order.setTotalAmount(total);
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .cakeId(item.getCakeId())
                        .cakeName(item.getCakeName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .customerEmail(order.getCustomerEmail())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }
}