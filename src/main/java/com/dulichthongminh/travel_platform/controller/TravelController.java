package com.dulichthongminh.travel_platform.controller;

import com.dulichthongminh.travel_platform.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/travel")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TravelController {

    @Autowired
    private AIService aiService;

    @GetMapping("/suggest")
    public String suggest(@RequestParam String destination, @RequestParam String preference) {
        // Gọi hàm suggestItinerary đã định nghĩa trong AIService
        return aiService.suggestItinerary(destination, preference);
    }
}