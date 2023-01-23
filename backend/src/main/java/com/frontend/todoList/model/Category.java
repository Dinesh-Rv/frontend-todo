package com.frontend.todoList.model;

import lombok.*;

/**
 * Defines a POJO for Categories of a to-do list,
 * Gets and sets values for each entity available in category
 * Contains required constructor for applying a new category
 * A category is like group or a container for sorting a task
 * which helps user to add their own task on a created category or
 * to add default category for admin in backend.
 * In default category each category has different role,
 * in which very task added in default category will be placed in last static default category
 * tasks in custom category will be only applied in custom category only.
 */
@NoArgsConstructor
@Setter
@Getter
@AllArgsConstructor
public class Category {
    private Integer id;
    private String iconName;
    private String name;

    @Override
    public String toString() {
        return "Category{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", iconClass='" + iconName + '\'' +
                '}';
    }
}
