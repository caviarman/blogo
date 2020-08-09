package server

import (
	"log"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
)

//User ...
type User struct {
	gorm.Model
	Email    string `json:"email" gorm:"type:varchar(500);not null"`
	Password string `json:"password" gorm:"type:varchar(500);not null"`
	Role     string `json:"role" gorm:"type:varchar(255);not null"`
}

func (u *User) isValid() bool {
	return u.Email != "" && u.Password != ""
}

func (u *User) generateAccessToken() (string, error) {
	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["userID"] = u.ID
	claims["email"] = u.Email
	claims["exp"] = time.Now().Add(time.Minute * 15).Unix()
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := accessToken.SignedString([]byte(config.JWTSecret))
	if err != nil {
		log.Printf("GenerateToken error #1: %+v\n", err)
		return "", err
	}
	return token, err

}
