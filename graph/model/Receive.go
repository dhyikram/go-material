package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type ItemReceivedC struct {
	ID  primitive.ObjectID `json:"id" bson:"_id"`
	Qty int                `json:"qty" bson:"qty"`
}
type ItemReceivedInput struct {
	ID  string `json:"id" bson:"_id"`
	Qty int    `json:"qty" bson:"qty"`
}

type RecevieInputConvertedChild struct {
	CreatedBy    string           `json:"CreatedBy" bson:"CreatedBy"`
	Description  string           `json:"description" bson:"description"`
	Requires     []CustomRequires `json:"requires" bson:"requires"`
	ItemReceived []ItemReceivedC  `json:"itemReceived" bson:"itemReceived"`
}

type ReceiveInput struct {
	CreatedBy    string              `json:"createdBy" bson:"createdBy"`
	Description  string              `json:"description" bson:"description"`
	Requires     []CustomRequires    `json:"requires" bson:"requires"`
	ItemReceived []ItemReceivedInput `json:"itemReceived" bson:"itemReceived"`
}

type Receive struct {
	ID           string           `json:"id" bson:"_id"`
	CreatedBy    string           `json:"CreatedBy" bson:"CreatedBy"`
	Description  string           `json:"description" bson:"description"`
	Requires     []CustomRequires `json:"requires" bson:"requires"`
	ItemReceived []ItemReceivedC  `json:"itemReceived" bson:"itemReceived"`
}

type RequiresParsed struct {
	ID  primitive.ObjectID `json:"id" bson:"_id"`
	Qty int                `json:"qty" bson:"qty"`
}

type ItemReceivedParsed struct {
	ID   string `json:"id" bson:"_id"`
	Name string `json:"name" bson:"name"`
	Qty  int    `json:"qty" bson:"qty"`
}

type Receives struct {
	ID           primitive.ObjectID `json:"id" bson:"_id"`
	CreatedBy    string             `json:"CreatedBy" bson:"CreatedBy"`
	Description  string             `json:"description" bson:"description"`
	ItemReceived []ItemReceived     `json:"itemReceived" bson:"itemReceived"`
}
