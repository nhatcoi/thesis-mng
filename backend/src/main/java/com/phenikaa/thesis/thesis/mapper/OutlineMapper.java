package com.phenikaa.thesis.thesis.mapper;

import com.phenikaa.thesis.thesis.dto.OutlineResponse;
import com.phenikaa.thesis.thesis.entity.Outline;
import com.phenikaa.thesis.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface OutlineMapper {

    @Mapping(target = "thesisId", source = "thesis.id")
    @Mapping(target = "reviewerName", source = "reviewedBy.user", qualifiedByName = "reviewerFullName")
    OutlineResponse toResponse(Outline outline);

    @Named("reviewerFullName")
    default String reviewerFullName(User user) {
        if (user == null) return null;
        String last = user.getLastName() != null ? user.getLastName() : "";
        String first = user.getFirstName() != null ? user.getFirstName() : "";
        return (last + " " + first).trim();
    }
}
