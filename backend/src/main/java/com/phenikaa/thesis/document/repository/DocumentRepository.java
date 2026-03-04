package com.phenikaa.thesis.document.repository;

import com.phenikaa.thesis.document.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    List<Document> findByThesisId(UUID thesisId);
}
