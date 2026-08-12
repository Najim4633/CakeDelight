package com.cakedelight.order.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import com.cakedelight.order.client.CatalogClient;
import com.cakedelight.order.dto.OrderResponse;
import com.cakedelight.order.entity.Order;
import com.cakedelight.order.entity.OrderStatus;
import com.cakedelight.order.exception.OrderNotFoundException;
import com.cakedelight.order.repository.OrderRepository;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @Mock
    private CatalogClient catalogClient;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        // Initialize a dummy order before each test runs
        sampleOrder = new Order();
        sampleOrder.setId(1L);
        sampleOrder.setCustomerEmail("customer@example.com");
        sampleOrder.setStatus(OrderStatus.PENDING);
        sampleOrder.setItems(new ArrayList<>()); // Prevent null pointer on mapping
    }

    @Test
    void testGetOrderById_Success() {
        // 1. Arrange: Tell Mockito what to return when the database is queried
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        // 2. Act: Call our actual service method
        OrderResponse response = orderService.getOrderById(1L);

        // 3. Assert: Verify the response matches our mock data
        assertNotNull(response);
        assertEquals("customer@example.com", response.getCustomerEmail());
        
        // Verify the repository was actually called exactly once
        verify(orderRepository, times(1)).findById(1L);
    }

    @Test
    void testGetOrderById_NotFound_ThrowsException() {
        // 1. Arrange: Tell Mockito to return empty (simulating no record in DB)
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        // 2 & 3. Act & Assert: Verify that calling this throws our custom exception
        assertThrows(OrderNotFoundException.class, () -> {
            orderService.getOrderById(99L);
        });

        // Verify the repository was queried
        verify(orderRepository, times(1)).findById(99L);
    }
}