package com.cakedelight.notification.controller;

import com.cakedelight.notification.entity.Notification;
import com.cakedelight.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        log.info("Fetching all notifications");
        return ResponseEntity.ok(notificationRepository.findAll());
    }
    
    

    @GetMapping("/customer/{email}")
    public ResponseEntity<List<Notification>> getNotificationsByEmail(@PathVariable String email) {
        log.info("Fetching notifications for recipient: {}", email);
        return ResponseEntity.ok(notificationRepository.findByRecipientEmail(email));
    }
}