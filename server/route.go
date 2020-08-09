package server

import (
	"log"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func declareRoutes() {
	r.NoRoute(clientHandler)
	//r.GET("/ws", startWS)

	authPost := r.Group("/post")
	authPost.Use(AdminAuthRequired())
	{
		authPost.POST("/", createPost)
		authPost.PATCH("/", updatePost)
		authPost.DELETE("/:id", deletePost)
	}

	r.GET("/posts", getPosts)
	r.GET("/post/:id", getPost)
	r.POST("/login", login)
}

//AdminAuthRequired ...
func AdminAuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := c.Query("auth")
		claims := TokenClaims{}
		token, err := jwt.ParseWithClaims(t, &claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(config.JWTSecret), nil
		})
		if err != nil {
			log.Printf("AdminAuthRequired error #1: %+v\n", err)
			c.JSON(http.StatusUnauthorized, map[string]interface{}{
				"error": err.Error(),
			})
			return
		}
		user := User{}
		db.Where("id = ?", claims.UserID).First(&user)
		if err == nil && token.Valid && user.Role == "admin" {
			c.Next()
		} else {
			c.JSON(http.StatusUnauthorized, map[string]interface{}{
				"error":      err.Error(),
				"role":       user.Role,
				"tokenValid": token.Valid,
			})
		}

	}
}

// TokenClaims ...
type TokenClaims struct {
	jwt.StandardClaims
	UserID     int    `json:"userID"`
	Email      string `json:"email"`
	Authorized bool   `json:"authorized"`
}
