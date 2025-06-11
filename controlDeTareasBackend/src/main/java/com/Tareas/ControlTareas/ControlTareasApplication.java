package com.Tareas.ControlTareas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.Tareas.ControlTareas")
@EnableJpaRepositories(basePackages = "com.Tareas.ControlTareas.Repository")
@EntityScan(basePackages = "com.Tareas.ControlTareas.Entity")
@Configuration
public class ControlTareasApplication {

	@Bean
	public RestTemplateBuilder restTemplateBuilder() {
		return new RestTemplateBuilder();
	}

	public static void main(String[] args) {
		SpringApplication.run(ControlTareasApplication.class, args);
	}

}
