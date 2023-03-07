package com.frontend.todoList.controller;

import com.frontend.todoList.model.Category;
import com.frontend.todoList.model.Task;
import com.frontend.todoList.model.User;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Works as controller for to-do list application which currently contains list
 * of categories
 * and tasks to apply user request manipulation corresponding to the task they
 * wanted to
 * create according to the category.
 * Contains functions supporting api operation for applying user request
 * for manipulating tasks and categories
 * category and task ids are applied according to the number of default
 * corresponding entries available
 * tasks can contain many category id and one of their category id mention their
 * importance of the task
 *
 * @author Dinesh Ravikumar
 * @since 16/01/2023
 */
@RestController
@CrossOrigin
@RequestMapping("todo")
public class Controller {

    private final List<Task> tasks = new ArrayList<>();
    private final List<User> users = new ArrayList<>();
    static List<Category> categories = new ArrayList<>();
    boolean check = false;
    int categoryId = 5;
    int userId = 0;
    int taskId = 0;

    /**
     * Generates the default categories for applying to do list category selection,
     * category and a task can contain many category id from these default category
     * and a new category can also be created by the request from the user
     */
    public static List<Category> generateDefaultCategory() {
        List<Category> userCategories = new ArrayList<>();
        Category myDay = new Category(1, "light_mode", "My Day");
        Category important = new Category(2, "star", "Important");
        Category planned = new Category(3, "calendar_month", "Planned");
        Category assignedToMe = new Category(4, "person", "Assigned to me");
        Category tasks = new Category(5, "home", "Tasks");
        userCategories.add(myDay);
        userCategories.add(important);
        userCategories.add(planned);
        userCategories.add(assignedToMe);
        userCategories.add(tasks);
        return userCategories;
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
    @PostMapping("/category/{userId}")
    public int saveCategory( @PathVariable int userId, @RequestBody Category category) {
        for (User user: users) {
            if (user.getId() == userId && category.getId() <= 0) {
                category.setId(++categoryId);
                user.getCategories().add(category);
                return category.getId();
            }
        }
        return 0;
    }

    /**
     * Gets all the categories in the category list and returns it,
     * commonly invoked when api request to get all categories
     * before getting categories, It checks if the categories list is empty,
     * if it is, it generates a default category and sets the check variable to true
     *
     * @return A list of categories
     */
    @GetMapping("/categories/{userId}")
    public List<Category> getCategories(@PathVariable int userId) {
        System.out.println("inside getCat");
        for (User user: users) {
            System.out.println(user);
            if (user.getId() == userId) {
                return user.getCategories();
            }
        }
        return null;
    }

    /**
     * Saves a new task or if the task request body already contains an id it
     * automatically updates
     * A new task will save when the body doesn't have an id with it,
     * consideration of a new task, it will generate a unique id to it and
     * apply to create a new task prior to its id
     * The task will be saved when the body for task was received with a valid id,
     * valid id is based upon the exact id from the task list than from the api
     * request body
     *
     * @param task new task object or a task object to update
     *             based upon the request body from the user
     */
    @PostMapping("/task")
    public Task saveAndUpdateTask(@RequestBody Task task) {
        if (task.getId() > 0) {
            Task oldTask = tasks.get(task.getId() - 1);
            oldTask.setCategoryIds(task.getCategoryIds());
            oldTask.setNote(task.getNote());
            oldTask.setCompleted(task.isCompleted());
            oldTask.setImportant(task.isImportant());
            oldTask.setNoteSavedAt(task.getNoteSavedAt());
        } else {
            task.setId(++taskId);
            tasks.add(task);
        }
        System.out.println(task);
        return task;
    }

    @PostMapping("/user")
    public User saveAndUpdateUser(@RequestBody User user) {
        if (user.getId() > 0) {
            User oldUser = users.get(user.getId() - 1);
            oldUser.setName(user.getName());
            oldUser.setPassword(user.getPassword());
            oldUser.setPhoneNumber(user.getPhoneNumber());
            oldUser.setEmailId(user.getEmailId());
        } else {
            List<Category> userCategory;
            userCategory = generateDefaultCategory();
            user.setId(++userId);
            user.setCategories(userCategory);
            users.add(user);
            System.out.println(user);
        }
        return user;
    }

    @PostMapping("/login")
    public User loginUser(@RequestBody User user) {
        for(User presentUser: users) {
            if(user.getName().equals(presentUser.getName()) && user.getPassword().equals(presentUser.getPassword())) {
                return presentUser;
            }
        }
        return null;
    }

    @GetMapping("/task/{categoryId}/{userId}")
    public List<Task> getTaskById(@PathVariable int categoryId, @PathVariable int userId) {
        List<Task> tasksById = new ArrayList<>();
        for (Task task : tasks) {
            for (int id : task.getCategoryIds()) {
                if (id == categoryId && task.getUserId() == userId) {
                    tasksById.add(task);
                }
            }
        }
        return tasksById;
    }
}
