package main

import (
	"memocards/server"

	_ "github.com/jinzhu/gorm/dialects/postgres"
)

func main() {
	server.Start()
}
