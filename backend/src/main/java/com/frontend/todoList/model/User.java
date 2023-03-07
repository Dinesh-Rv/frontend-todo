package com.frontend.todoList.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {
    private int id;
    private String name;
    private String password;
    private String emailId;
    private String phoneNumber;
    private List<Category> categories;

    @Override
    public String toString() {
    return "User==={" +
           "id= " + id +
           ", name= " + name +
           ", password= " + password +
           ", emailId= " + emailId +
           ", phoneNumber= " + phoneNumber +
            ",category=" + categories +
           "}";
}

}

