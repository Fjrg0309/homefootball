package com.example.catalog;

import com.example.catalog.web.BookController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookController.class)
class BookControllerTextTest {

    @Autowired
    MockMvc mvc;

    @Test
    void echo_get_books() throws Exception {
        mvc.perform(get("/books"))
                .andExpect(status().isOk())
                .andExpect(content().string("GET /books"));
    }
}
