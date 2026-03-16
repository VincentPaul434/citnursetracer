package com.alumni.survey;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.alumni")
@EntityScan(basePackages = "com.alumni.tracer")
@EnableJpaRepositories(basePackages = "com.alumni.tracer")
public class SurveyApplication {

	public static void main(String[] args) {
		SpringApplication.run(SurveyApplication.class, args);
	}

}
