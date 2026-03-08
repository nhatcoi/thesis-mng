package com.phenikaa.thesis.batch.mapper;

import com.phenikaa.thesis.batch.dto.ThesisBatchResponse;
import com.phenikaa.thesis.batch.entity.ThesisBatch;
import com.phenikaa.thesis.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ThesisBatchMapper {

    @Mapping(target = "academicYearId", source = "academicYear.id")
    @Mapping(target = "academicYearName", source = "academicYear.name")
    @Mapping(target = "createdById", source = "createdBy.id")
    @Mapping(target = "createdByName", source = "createdBy", qualifiedByName = "fullName")
    ThesisBatchResponse toResponse(ThesisBatch batch);

    @Named("fullName")
    default String fullName(User user) {
        if (user == null) return null;
        String last = user.getLastName() != null ? user.getLastName() : "";
        String first = user.getFirstName() != null ? user.getFirstName() : "";
        return (last + " " + first).trim();
    }
}
