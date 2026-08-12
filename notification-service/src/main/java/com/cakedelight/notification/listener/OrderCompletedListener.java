package com.cakedelight.notification.listener;

import com.cakedelight.notification.config.RabbitMQConfig;
import com.cakedelight.notification.entity.Notification;
import com.cakedelight.notification.event.OrderCompletedEvent;
import com.cakedelight.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderCompletedListener {

    private final NotificationRepository notificationRepository;

    @RabbitListener(queues = RabbitMQConfig.ORDER_QUEUE)
    public void handleOrderCompletedEvent(OrderCompletedEvent event) {
        log.info("Received OrderCompletedEvent for Order ID: {} and Customer: {}", event.getOrderId(), event.getCustomerEmail());

        // Simulate sending a confirmation notification (Email / SMS)
        String messageBody = "Dear Customer, your order #" + event.getOrderId() + " amounting to $" + event.getTotalAmount() + " has been successfully placed!";

        Notification notification = Notification.builder()
                .orderId(event.getOrderId())
                .recipientEmail(event.getCustomerEmail())
                .message(messageBody)
                .status("SENT")
                .sentAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
        log.info("Notification successfully processed and saved for Order ID: {}", event.getOrderId());
    }
}