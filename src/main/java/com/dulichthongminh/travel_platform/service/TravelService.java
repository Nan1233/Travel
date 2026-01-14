package com.dulichthongminh.travel_platform.service;

import com.dulichthongminh.travel_platform.entity.Destination;
import com.dulichthongminh.travel_platform.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TravelService {
    @Autowired
    private DestinationRepository destinationRepository;

    // Thuật toán gợi ý đơn giản dựa trên sở thích người dùng [cite: 26]
    public List<Destination> getRecommendedItinerary(String userPreference) {
        return destinationRepository.findByCategory(userPreference);
    }
}