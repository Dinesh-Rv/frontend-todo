package com.frontend.todoList.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

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
