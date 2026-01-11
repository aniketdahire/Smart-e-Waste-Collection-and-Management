package com.smartewaste.backend.repository;

import com.smartewaste.backend.entity.CollectionRequest;
import com.smartewaste.backend.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CollectionRequestRepository extends JpaRepository<CollectionRequest, Long> {
    List<CollectionRequest> findByUser(UserAccount user);

    List<CollectionRequest> findByUserOrderByCreatedAtDesc(UserAccount user);

    // ✅ Find requests assigned to specific personnel
    List<CollectionRequest> findByPickupPersonnel(String pickupPersonnel);
}
