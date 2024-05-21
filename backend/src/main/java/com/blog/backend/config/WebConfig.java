package com.blog.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3001") // Specify the origin you want to allow
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Specify the methods allowed
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
