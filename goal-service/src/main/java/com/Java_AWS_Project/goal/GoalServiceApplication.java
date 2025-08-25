package com.Java_AWS_Project.goal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.cache.annotation.EnableCaching;
@EnableCaching
@SpringBootApplication
public class GoalServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(GoalServiceApplication.class, args);
    }
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
