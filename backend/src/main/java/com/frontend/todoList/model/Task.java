package com.frontend.todoList.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

/**
 * Defines a POJO for Tasks of a to-do list,
 * Gets and sets values for each entity available in task
 * Contains required constructor for applying a new task
 * A task contains many attribute such as completed status, list of category ids and
 * created at to make use of the date origin the task was created
 * task contain list of category ids to render the required the task to
 * their corresponding selected category.
 * id creation of task will be maintainer controller while adding a new task.
 * Task contains note and status of the note saved which can be used to make the user
 * know when the note was saved and updated.
 *
 */
@NoArgsConstructor
@Setter
@Getter
@AllArgsConstructor
public class Task {
    private int id;
    private String name;
    @JsonProperty(value="isCompleted")
    private boolean isCompleted;
    private String createdAt;
    private List<Integer> categoryIds;
    private String note;
    private String noteSavedAt;

    @Override
    public String toString() {
        return "Task{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", isCompleted=" + isCompleted +
                ", createdAt=" + createdAt +
                ", category=" + categoryIds +
                ", note='" + note + '\'' +
                ", noteSavedAt=" + noteSavedAt +
                '}';
    }
}
