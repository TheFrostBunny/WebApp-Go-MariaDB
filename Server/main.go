package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"todo-api/database"
	"todo-api/routes"
)

// ANSI escape codes for farger
const (
	Reset  = "\033[0m"
	Red    = "\033[31m"
	Green  = "\033[32m"
	Yellow = "\033[33m"
	Blue   = "\033[34m"
	Cyan   = "\033[36m"
)

func main() {
	// Load .env
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("Fant ikke .env i overmappen")
	}

	// Connect to database
	database.Connect()

	// Release mode for Gin (fjerner [GIN-debug] startup logs)
	gin.SetMode(gin.ReleaseMode)

	// Opprett engine uten default debug logger
	r := gin.New()

	// Logger med farger og custom format
	r.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		statusColor := Green
		methodColor := Blue

		// Status color
		if param.StatusCode >= 400 && param.StatusCode < 500 {
			statusColor = Yellow
		} else if param.StatusCode >= 500 {
			statusColor = Red
		}

		// Method color
		switch param.Method {
		case "POST":
			methodColor = Cyan
		case "DELETE":
			methodColor = Red
		case "PUT":
			methodColor = Yellow
		case "GET":
			methodColor = Green
		}

		return fmt.Sprintf("[GIN] %s |%s %3d %s| %13v | %15s |%s %-7s %s%s\n",
			param.TimeStamp.Format("2006/01/02 - 15:04:05"),
			statusColor, param.StatusCode, Reset,
			param.Latency,
			param.ClientIP,
			methodColor, param.Method, Reset,
			param.Path,
		)
	}))

	r.Use(gin.Recovery())
	r.Use(cors.Default())
	r.SetTrustedProxies([]string{"127.0.0.1"})

	// Register routes
	routes.RegisterRoutes(r)

	// Start server
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "3000"
	}

	log.Println("Server running on port", port)
	r.Run(":" + port)
}
