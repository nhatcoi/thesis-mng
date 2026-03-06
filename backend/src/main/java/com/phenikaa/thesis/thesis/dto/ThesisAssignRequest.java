package com.phenikaa.thesis.thesis.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class ThesisAssignRequest {
    private UUID batchId;
    private List<UUID> studentIds;
}
