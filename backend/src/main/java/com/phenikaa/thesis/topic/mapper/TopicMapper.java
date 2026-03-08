package com.phenikaa.thesis.topic.mapper;

import com.phenikaa.thesis.topic.dto.TopicRegistrationResponse;
import com.phenikaa.thesis.topic.dto.TopicResponse;
import com.phenikaa.thesis.topic.entity.Topic;
import com.phenikaa.thesis.topic.entity.TopicRegistration;
import com.phenikaa.thesis.topic.entity.enums.TopicSource;
import com.phenikaa.thesis.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface TopicMapper {

    @Mapping(target = "batchId", source = "batch.id")
    @Mapping(target = "batchName", source = "batch.name")
    @Mapping(target = "proposedById", source = "proposedBy.id")
    @Mapping(target = "proposedByName", source = "proposedBy", qualifiedByName = "fullName")
    @Mapping(target = "majorName", ignore = true) // resolved via majorRepo in service
    TopicResponse toResponse(Topic topic);

    @Mapping(target = "topicId", source = "topic.id")
    @Mapping(target = "topicTitle", source = "topic.title")
    @Mapping(target = "topicDescription", source = "topic.description")
    @Mapping(target = "topicRequirements", source = "topic.requirements")
    @Mapping(target = "topicSource", source = "topic.source")
    @Mapping(target = "studentId", source = "student.id")
    @Mapping(target = "studentCode", source = "student.studentCode")
    @Mapping(target = "studentName", source = "student.user", qualifiedByName = "fullName")
    @Mapping(target = "advisorName", ignore = true) // complex logic in service
    TopicRegistrationResponse toRegistrationResponse(TopicRegistration reg);

    @Named("fullName")
    default String fullName(User user) {
        if (user == null) return null;
        String last = user.getLastName() != null ? user.getLastName() : "";
        String first = user.getFirstName() != null ? user.getFirstName() : "";
        return (last + " " + first).trim();
    }
}
