package com.phenikaa.thesis.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Thesis Management API")
                        .description("API hệ thống Quản lý Đồ án Tốt nghiệp - Đại học Phenikaa")
                        .version("0.0.1-SNAPSHOT")
                        .contact(new Contact()
                                .name("Phenikaa University")
                                .email("admin@phenikaa.edu.vn")));
    }
}
