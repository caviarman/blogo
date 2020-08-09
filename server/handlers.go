package server

import (
	"fmt"
	"log"
	"net/http"
	"path"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

func clientHandler(c *gin.Context) {
	dir, file := path.Split(c.Request.RequestURI)
	ext := filepath.Ext(file)
	if file == "" || ext == "" {
		c.File("./client/dist/blog/index.html")
	} else {
		c.File("./client/dist/blog/" + path.Join(dir, file))
	}
}

// func startWS(c *gin.Context) {
// 	ws.ServeWs(hub, c.Writer, c.Request)
// }

func getPosts(c *gin.Context) {
	posts := []Post{}
	fmt.Printf("db = %+v\n", db)

	db.Find(&posts)
	c.JSON(http.StatusOK, posts)
}

func getPost(c *gin.Context) {
	param := c.Param("id")
	id, err := strconv.Atoi(param)
	if err != nil {
		log.Printf("getPost #1 can't convert id to int: %+v\n", err)
	}
	post := Post{}
	db.First(&post, id)
	c.JSON(http.StatusOK, post)
}

func createPost(c *gin.Context) {
	post := Post{}

	if err := c.ShouldBindJSON(&post); err != nil {
		fmt.Printf("setPost #1 = %+v\n", err)
	}
	if isNew := db.NewRecord(post); isNew {
		db.Create(&post)
	}
}

func updatePost(c *gin.Context) {
	post := Post{}
	if err := c.ShouldBindJSON(&post); err != nil {
		fmt.Printf("updatePost #1 = %+v\n", err)
	}
	db.Save(&post)
}

func deletePost(c *gin.Context) {
	param := c.Param("id")
	id, err := strconv.Atoi(param)
	if err != nil {
		log.Printf("deletePost #1 can't convert id to int: %+v\n", err)
	}
	post := Post{}
	post.ID = uint(id)
	db.Delete(&post)
}

func login(c *gin.Context) {
	var (
		user  User
		token string
		err   error
	)
	if err = c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusUnprocessableEntity, "login error; Invalid json provided")
		return
	}
	if user.isValid() {
		db.Where("email = ? AND password = ?", user.Email, user.Password).Find(&user)
	}
	if user.ID > 0 {
		token, err = user.generateAccessToken()
		if err != nil {
			c.JSON(http.StatusInternalServerError, "login error; Can't generate token")
			return
		}
	}
	c.JSON(http.StatusOK, map[string]string{
		"token": token,
	})
}
