package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type CustomRequires struct {
	ID  primitive.ObjectID `json:"id" bson:"_id"`
	Qty int                `json:"qty" bson:"qty"`
}

type CustomInputItem struct {
	Name     string           `json:"name" bson:"name"`
	Stock    int              `json:"stock" bson:"stock"`
	Category string           `json:"category" bson:"category"`
	Requires []CustomRequires `json:"requires" bson:"requires"`
}

type CustomItemResponse struct {
	ID       string            `json:"id" bson:"_id"`
	Name     string            `json:"name" bson:"name"`
	Stock    int               `json:"stock" bson:"stock"`
	Category string            `json:"category" bson:"category"`
	Requires []*CustomRequires `json:"requires" bson:"requires"`
}

type CustomInputReceive struct {
	CreatedBy   string           `json:"CreatedBy" bson:"_id"`
	Description string           `json:"description" bson:"description"`
	Requires    []CustomRequires `json:"requires" bson:"requires"`
}

type aggregateRequires struct {
	ID  string `json:"id" bson:"_id"`
	Qty int    `json:"qty" bson:"qty"`
}
type AggretageItem struct {
	ID       string            `json:"id" bson:"_id"`
	Name     string            `json:"name" bson:"name"`
	Stock    int               `json:"stock" bson:"stock"`
	Category string            `json:"category" bson:"category"`
	Requires aggregateRequires `json:"requires" bson:"requires"`
}

type BSONID primitive.ObjectID
