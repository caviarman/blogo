package server

import (
	"github.com/jinzhu/gorm"
)

//Post is the struct for reflecting blog post item
type Post struct {
	gorm.Model
	Author  string `json:"author" gorm:"type:varchar(255);not null"`
	Avatar  string `json:"avatar" gorm:"type:varchar(500)"`
	Image   string `json:"image" gorm:"type:varchar(500)"`
	Preview string `json:"preview" gorm:"type:varchar(500);not null"`
	Text    string `json:"text" gorm:"type:text;not null"`
	Title   string `json:"title" gorm:"type:varchar(255);not null"`
	Comment string `json:"comment" gorm:"type:text"`
}
