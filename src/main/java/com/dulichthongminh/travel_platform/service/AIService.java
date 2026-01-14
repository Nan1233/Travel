package com.dulichthongminh.travel_platform.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AIService {
    // API Key của bạn
    private final String API_KEY = "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";
    private final String URL = "https://openrouter.ai/api/v1/chat/completions";

    public String askGemini(String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + API_KEY);
            // Headers bắt buộc để OpenRouter nhận diện
            headers.set("HTTP-Referer", "http://localhost:8080");
            headers.set("X-Title", "Travel Platform AI");

            // SỬA MODEL SANG MISTRAL-7B-INSTRUCT:FREE - ĐẢM BẢO KHÔNG LỖI 404
            String jsonBody = "{"
                    + "\"model\": \"mistralai/mistral-7b-instruct:free\","
                    + "\"messages\": [{\"role\": \"user\", \"content\": \""
                    + prompt.replace("\"", "'").replace("\n", " ") + "\"}]"
                    + "}";

            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(URL, entity, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            // Trích xuất kết quả trả về từ OpenRouter
            if (root.has("choices") && root.path("choices").size() > 0) {
                return root.path("choices").get(0).path("message").path("content").asText();
            }
            return "AI đang chuẩn bị nội dung lịch trình, vui lòng thử lại sau giây lát!";
        } catch (Exception e) {
            System.err.println("LỖI HỆ THỐNG AI: " + e.getMessage());
            return "Lỗi kết nối AI: " + e.getMessage();
        }
    }

    // Hàm gọi từ Controller của bạn
    public String suggestItinerary(String destination, String preference) {
        String finalPrompt = "Bạn là chuyên gia du lịch. Hãy lập lịch trình 2 ngày 1 đêm tại " + destination
                + " cho người thích " + preference + " bằng tiếng Việt. Trình bày rõ ràng.";
        return askGemini(finalPrompt);
    }
}