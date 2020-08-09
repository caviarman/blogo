package server

import (
	"log"

	"github.com/spf13/viper"
)

// Config ...
type Config struct {
	Port      string   `json:"port"`
	Database  Postgres `json:"database"`
	JWTSecret string   `json:"jwtSecret"`
}

// Postgres ...
type Postgres struct {
	Host     string `json:"host"`
	Port     string `json:"port"`
	User     string `json:"user"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

//GetConfig ...
func getConfig(path string) (*Config, error) {
	var (
		err  error
		conf Config
	)
	viper.SetConfigName("config")
	viper.AddConfigPath(path)
	err = viper.ReadInConfig()
	if err != nil {
		log.Printf("getConfig error #1: %+v\n", err)
		return &conf, err
	}
	err = viper.Unmarshal(&conf)
	if err != nil {
		log.Printf("getConfig error #2: %+v\n", err)
		return &conf, err
	}
	return &conf, err
}
