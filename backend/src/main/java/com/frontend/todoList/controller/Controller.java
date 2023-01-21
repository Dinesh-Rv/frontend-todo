package com.frontend.todoList.controller;

import com.frontend.todoList.model.Category;
import com.frontend.todoList.model.Task;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("todo")
public class Controller {

    private List<Task> tasks = new ArrayList<>();
    static List<Category> categories = new ArrayList<>();
    boolean check = false;
    int categoryId = 6;
    int taskId = 0;

    public static void generateDefaultCategory() {
        Category myDay = new Category(1, "light_mode", "My Day");
        Category important = new Category(2, "star", "Important");
        Category planned = new Category(3, "calendar_month", "Planned");
        Category assignedToMe = new Category(4,"person", "Assigned to me");
        Category tasks = new Category(5,"home", "Tasks");
        Category sampleCategory = new Category(6, "list", "Sample Category");
        categories.add(myDay);
        categories.add(important);
        categories.add(planned);
        categories.add(assignedToMe);
        categories.add(tasks);
        categories.add(sampleCategory);
    }

    @PostMapping("/category")
    public int saveAndUpdateCategory(@RequestBody Category category) {
        category.setId(++categoryId);
        categories.add(category);
        System.out.println(category);
        return category.getId();
    }

    @GetMapping("/categories")
    public List<Category> getCategories() {
        if (!check) {
            generateDefaultCategory();
            check = true;
        }
        return categories;
    }

    @PostMapping("/task")
    public void saveAndUpdateTask(@RequestBody Task task) {
        if(task.getId() > 0) {
            Task oldTask = tasks.get(task.getId()-1);
            oldTask.setCategoryIds(task.getCategoryIds());
            oldTask.setNote(task.getNote());
            oldTask.setCompleted(task.isCompleted());
        } else {
            task.setId(++taskId);
            tasks.add(task);
        }
        System.out.println(task);
    }

    @GetMapping("/tasks")
    public List<Task> getAllTasks() {
        return tasks;
    }

    @GetMapping("/category/{id}")
    public Category getCategoryById(@PathVariable int id) {
        Category requiredCategory = new Category();
        for (Category category : categories) {
            if(category.getId() == id) {
                requiredCategory = category;
                break;
            }
        }
        System.out.println(requiredCategory);
        return requiredCategory;
    }

    @GetMapping("/task/{id}")
    public Task getTaskById(@PathVariable int id) {
        Task requiredTask = new Task();
        for (Task task : tasks) {
            if (task.getId() == id) {
                requiredTask = task;
                break;
            }
        }
        System.out.println(requiredTask);
        return requiredTask;
    }
}
