package com.dulichthongminh.travel_platform.controller;

import com.dulichthongminh.travel_platform.entity.Post;
import com.dulichthongminh.travel_platform.repository.PostRepository;
import com.dulichthongminh.travel_platform.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AIController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private AIService aiService;

    /**
     * Endpoint kết hợp dữ liệu Cộng đồng và AI để tạo lịch trình du lịch
     * 
     * @param destination Địa điểm muốn đến
     * @param preference  Sở thích của người dùng (từ Profile)
     * @return Chuỗi văn bản lịch trình định dạng Markdown
     */
    @GetMapping("/recommend")
    public String getAIAdvice(@RequestParam String destination, @RequestParam String preference) {

        // 1. Lấy dữ liệu thực tế từ các bài viết trong Cộng đồng dựa trên từ khóa địa
        // điểm
        List<Post> communityPosts = postRepository.findAll().stream()
                .filter(p -> p.getContent().toLowerCase().contains(destination.toLowerCase()))
                // Sắp xếp theo số lượng Like để lấy các bài viết uy tín nhất
                .sorted((p1, p2) -> Integer.compare(p2.getLikedUserIds().size(), p1.getLikedUserIds().size()))
                .limit(5) // Lấy tối đa 5 bài viết nổi bật
                .collect(Collectors.toList());

        // 2. Xây dựng ngữ cảnh (Context) dựa trên dữ liệu cộng đồng
        StringBuilder contextBuilder = new StringBuilder();
        contextBuilder.append("Thông tin cơ bản:\n");
        contextBuilder.append("- Điểm đến: ").append(destination).append("\n");
        contextBuilder.append("- Sở thích người dùng: ").append(preference).append("\n\n");

        if (!communityPosts.isEmpty()) {
            contextBuilder.append("Kinh nghiệm thực tế từ cộng đồng TRAVEL-AI:\n");
            for (Post p : communityPosts) {
                // Làm sạch nội dung bài viết để đưa vào Prompt
                String cleanContent = p.getContent().replace("\"", "'").replace("\n", " ");
                contextBuilder.append("- [Người dùng ").append(p.getUser().getFullName())
                        .append("]: \"").append(cleanContent).append("\"\n");
            }
        }

        // 3. Tạo Prompt cuối cùng để gửi cho Gemini
        String finalPrompt = String.format(
                "%s\n" +
                        "Nhiệm vụ: Bạn là một chuyên gia lập kế hoạch du lịch. " +
                        "Dựa trên thông tin cộng đồng và sở thích trên, hãy lập lịch trình 2 ngày 1 đêm tối ưu tại %s. "
                        +
                        "Yêu cầu trả về bằng tiếng Việt, trình bày Markdown chuyên nghiệp (có dấu # cho tiêu đề, * cho danh sách) và lồng ghép khéo léo các gợi ý từ cộng đồng.",
                contextBuilder.toString(), destination);

        // 4. Gọi AIService để lấy phản hồi từ mô hình AI thật (Gemini 1.5 Flash hoặc
        // Pro)
        try {
            return aiService.askGemini(finalPrompt);
        } catch (Exception e) {
            // Trường hợp AI lỗi, trả về Mockup để giao diện không bị trắng
            return "### Lịch trình gợi ý cho " + destination + " (Chế độ dự phòng)\n" +
                    "* AI đang bận xử lý dữ liệu cộng đồng. Dựa trên sở thích " + preference +
                    ", bạn có thể bắt đầu khám phá trung tâm thành phố và các quán ăn nổi bật.";
        }
    }
}