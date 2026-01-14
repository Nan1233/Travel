package com.dulichthongminh.travel_platform.repository;

import com.dulichthongminh.travel_platform.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
    // Tìm kiếm địa điểm theo loại hình để phục vụ AI gợi ý [cite: 33]
    List<Destination> findByCategory(String category);
}