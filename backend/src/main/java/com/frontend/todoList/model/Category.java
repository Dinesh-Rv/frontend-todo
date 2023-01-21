package com.frontend.todoList.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

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
