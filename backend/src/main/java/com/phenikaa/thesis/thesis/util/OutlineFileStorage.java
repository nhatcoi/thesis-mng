package com.phenikaa.thesis.thesis.util;

import com.phenikaa.thesis.common.exception.BusinessException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class OutlineFileStorage {

    private static final String UPLOAD_DIR = "uploads/outlines";

    public String save(MultipartFile file, UUID thesisId, int version) {
        try {
            Path baseDir = Paths.get(System.getProperty("user.dir"), UPLOAD_DIR, thesisId.toString());
            Files.createDirectories(baseDir);
            String fileName = "outline_v" + version + "_" + System.currentTimeMillis() + ".pdf";
            Path filePath = baseDir.resolve(fileName);
            file.transferTo(filePath.toFile());
            return filePath.toString();
        } catch (IOException e) {
            throw new BusinessException("Lỗi khi lưu file đề cương: " + e.getMessage());
        }
    }
}
