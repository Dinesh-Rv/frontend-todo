package com.frontend.todoList;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main class for running the To-Do application
 * which runs the entire spring boot to get and post operations
 * for data corresponding for to-do list.
 * Works as an entry point for application by launching it
 */
@SpringBootApplication
public class TodoListApplication {

	/**
	 * runs the spring boot application for accessing and
	 * inserting data for to do list application
	 */
	public static void main(String[] args) {
		SpringApplication.run(TodoListApplication.class, args);
	}
}
