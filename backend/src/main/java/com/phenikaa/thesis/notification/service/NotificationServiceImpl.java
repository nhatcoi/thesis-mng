package com.phenikaa.thesis.notification.service;

import com.phenikaa.thesis.notification.dto.NotificationResponse;
import com.phenikaa.thesis.notification.entity.Notification;
import com.phenikaa.thesis.notification.entity.enums.NotificationType;
import com.phenikaa.thesis.notification.mapper.NotificationMapper;
import com.phenikaa.thesis.notification.repository.NotificationRepository;
import com.phenikaa.thesis.user.entity.User;
import com.phenikaa.thesis.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepo;
    private final NotificationMapper notificationMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(UUID userId) {
        return notificationRepo.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream().map(notificationMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {
        return notificationRepo.countByRecipientIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional
    public void markAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
        if (!notification.getRecipient().getId().equals(userId))
            throw new RuntimeException("Access Denied");
        notification.setIsRead(true);
        notificationRepo.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(UUID userId) {
        List<Notification> unread = notificationRepo.findByRecipientIdAndIsReadFalse(userId);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepo.saveAll(unread);
    }

    /** Lưu DB + push real-time qua WebSocket */
    @Override
    @Transactional
    public void sendNotification(User recipient, NotificationType type, String title,
                                 String message, String refType, UUID refId) {
        Notification notification = Notification.builder()
                .recipient(recipient).type(type).title(title)
                .message(message).isRead(false)
                .referenceType(refType).referenceId(refId)
                .build();
        notification = notificationRepo.save(notification);
        NotificationResponse response = notificationMapper.toResponse(notification);

        try {
            messagingTemplate.convertAndSend("/topic/notifications/" + recipient.getId(), response);
            log.debug("WS notification sent to user {}: {}", recipient.getId(), title);
        } catch (Exception e) {
            log.warn("WS notification failed for user {}: {}", recipient.getId(), e.getMessage());
        }
    }
}
