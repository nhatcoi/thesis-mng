package com.phenikaa.thesis.notification.service;

import com.phenikaa.thesis.notification.dto.NotificationResponse;
import com.phenikaa.thesis.notification.entity.enums.NotificationType;
import com.phenikaa.thesis.user.entity.User;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    List<NotificationResponse> getMyNotifications(UUID userId);
    long getUnreadCount(UUID userId);
    void markAsRead(UUID notificationId, UUID userId);
    void markAllAsRead(UUID userId);
    void sendNotification(User recipient, NotificationType type, String title, String message, String refType, UUID refId);
}
