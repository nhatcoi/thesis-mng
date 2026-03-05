package com.phenikaa.thesis.user.dto.importing;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ImportResult {
    private int successCount;
    private int failureCount;
    private List<RowError> errors;

    @Data
    @Builder
    public static class RowError {
        private int rowNumber;
        private String identifier; // username or whatever
        private String message;
    }
}
