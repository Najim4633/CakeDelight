package com.cakedelight.order.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCompletedEvent {

    private Long orderId;

    private String customerEmail;

    private BigDecimal totalAmount;

    private LocalDateTime completedAt;
}