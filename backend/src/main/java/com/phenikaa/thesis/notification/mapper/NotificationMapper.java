package com.phenikaa.thesis.notification.mapper;

import com.phenikaa.thesis.notification.dto.NotificationResponse;
import com.phenikaa.thesis.notification.entity.Notification;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    NotificationResponse toResponse(Notification notification);
}
