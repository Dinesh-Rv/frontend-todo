package com.frontend.todoList.controller;

import com.frontend.todoList.model.Category;
import com.frontend.todoList.model.Task;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Works as controller for to-do list application which currently contains list of categories
 * and tasks to apply user request manipulation corresponding to the task they wanted to
 * create according to the category.
 * Contains functions supporting api operation for applying user request
 * for manipulating tasks and categories
 * category and task ids are applied according to the number of default corresponding entries available
 * tasks can contain many category id and one of their category id mention their importance of the task
 *
 * @author Dinesh Ravikumar
 * @since 16/01/2023
 */
@RestController
@CrossOrigin
@RequestMapping("todo")
public class Controller {

    private final List<Task> tasks = new ArrayList<>();
    static List<Category> categories = new ArrayList<>();
    boolean check = false;
    int categoryId = 6;
    int taskId = 0;

    /**
     * Generates the default categories for applying to do list category selection,
     * category and a task can contain many category id from these default category
     * and a new category can also be created by the request from the user
     */
    public static void generateDefaultCategory() {
        Category myDay = new Category(1, "light_mode", "My Day");
        Category important = new Category(2, "star", "Important");
        Category planned = new Category(3, "calendar_month", "Planned");
        Category assignedToMe = new Category(4,"person", "Assigned to me");
        Category tasks = new Category(5,"home", "Tasks");
        categories.add(myDay);
        categories.add(important);
        categories.add(planned);
        categories.add(assignedToMe);
        categories.add(tasks);
    }

    /**
     * Saves the category in the list, commonly invoked when user
     * api request needs a new category to be created,
     * It will create a category and applies the new id for it
     * and adds the new category to the corresponding list
     *
     * @param category the new category object which will be
     *                 added to the category list
     * @return the id of the category if it was added successfully
     */
    @PostMapping("/category")
    public int saveCategory(@RequestBody Category category) {
        category.setId(++categoryId);
        categories.add(category);
        return category.getId();
    }

    /**
     * Gets all the categories in the category list and returns it,
     * commonly invoked when api request to get all categories
     * before getting categories, It checks if the categories list is empty,
     * if it is, it generates a default category and sets the check variable to true
     * @return A list of categories
     */
    @GetMapping("/categories")
    public List<Category> getCategories() {
        if (!check) {
            generateDefaultCategory();
            check = true;
        }
        return categories;
    }

    /**
     * Saves a new task or if the task request body already contains an id it automatically updates
     * A new task will save when the body doesn't have an id with it,
     * consideration of a new task, it will generate a unique id to it and
     * apply to create a new task prior to its id
     * The task will be saved when the body for task was received with a valid id,
     * valid id is based upon the exact id from the task list than from the api request body
     *
     * @param task new task object or a task object to update
     *             based upon the request body from the user
     */
    @PostMapping("/task")
    public int saveAndUpdateTask(@RequestBody Task task) {
        if(task.getId() > 0) {
            Task oldTask = tasks.get(task.getId()-1);
            oldTask.setCategoryIds(task.getCategoryIds());
            oldTask.setNote(task.getNote());
            oldTask.setCompleted(task.isCompleted());
            oldTask.setNoteSavedAt(task.getNoteSavedAt());
        } else {
            task.setId(++taskId);
            tasks.add(task);
        }
        return task.getId();
    }

    /**
     * Gets all the task from the task list, task contains the entries from the user for to-do list
     * A task contains many attribute such as completed status, list of category ids and
     * created at to make use of the date origin the task was created
     * task contain list of category ids to render the required the task to
     * their corresponding selected category.
     * task contains note and status of the note saved which can be used to make the user
     * know when the note was saved and updated
     *
     * @return list of available task, will return null if there is no task in the task list
     */
    @GetMapping("/tasks")
    public List<Task> getAllTasks() {
        return tasks;
    }
}
