package handlers

import (
	"net/http"

	"todo-api/database"
	"todo-api/models"

	"github.com/gin-gonic/gin"
)

// Hent alle todos
func GetTodos(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, task, completed FROM todos")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var todos []models.Todo
	for rows.Next() {
		var t models.Todo
		if err := rows.Scan(&t.ID, &t.Task, &t.Completed); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		todos = append(todos, t)
	}

	c.JSON(http.StatusOK, todos)
}

// Legg til en todo
func CreateTodo(c *gin.Context) {
	var body struct {
		Task string `json:"task"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ugyldig JSON"})
		return
	}

	result, err := database.DB.Exec("INSERT INTO todos (task) VALUES (?)", body.Task)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{
		"id":        id,
		"task":      body.Task,
		"completed": false,
	})
}

// Oppdater en todo
func UpdateTodo(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Task      string `json:"task"`
		Completed bool   `json:"completed"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ugyldig JSON"})
		return
	}

	res, err := database.DB.Exec("UPDATE todos SET task=?, completed=? WHERE id=?", body.Task, body.Completed, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Todo ikke funnet"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Todo oppdatert"})
}

// Slett en todo
func DeleteTodo(c *gin.Context) {
	id := c.Param("id")

	res, err := database.DB.Exec("DELETE FROM todos WHERE id=?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Todo ikke funnet"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Todo slettet"})
}
