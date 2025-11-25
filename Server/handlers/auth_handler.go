package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ugyldig JSON"})
		return
	}

	// TODO: sjekk bruker i DB
	// TODO: generer JWT token

	c.JSON(http.StatusOK, gin.H{
		"message": "Innlogging ikke fullført (placeholder)",
	})
}
