package server

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

var (
	r *gin.Engine
	//hub *ws.Hub
	db     *gorm.DB
	config *Config
)

//Start is the main func for starting server
func Start() {
	var err error
	//load config.json
	config, err = getConfig(".")
	if err != nil {
		log.Printf("getConfig error: %+v\n", err)
	}

	port := os.Getenv("PORT")

	if port == "" {
		port = config.Port
	}

	db, err = gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s",
		config.Database.Host,
		config.Database.Port,
		config.Database.User,
		config.Database.Name,
		config.Database.Password,
	))

	defer db.Close()

	db.AutoMigrate(&Post{})
	db.AutoMigrate(&User{})

	// hub = ws.NewHub()
	// go hub.Run()

	r = gin.Default()
	r.Use(CORSMiddleware())
	declareRoutes()

	err = r.Run(":" + port)
	if err != nil {
		panic(err)
	}
}

// CORSMiddleware will set allowable origins and content
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "DELETE, GET, OPTIONS, POST, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
