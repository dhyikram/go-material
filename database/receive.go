package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/dhyikram/go-material/graph/model"
	"github.com/dhyikram/go-material/service"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func (db *DB) AddStock(id string, qty int) {
	collection := db.client.Database(DBName).Collection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	// update items
	ObjectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Fatal(err)
	}
	collection.FindOneAndUpdate(ctx, bson.M{"_id": ObjectID}, bson.M{"$inc": bson.M{"stock": qty}})
}

func (db *DB) CreateReceive(input model.ReceiveInput) *model.Receive {
	collection := db.client.Database(DBName).Collection("Receive")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// convert input RecevieInput.ItemReceivedInput. to bson
	var itemReceived []model.ItemReceivedC
	for _, item := range input.ItemReceived {
		// Convert item.ID to bson
		ObjectID, err := primitive.ObjectIDFromHex(item.ID)
		if err != nil {
			log.Fatal(err)
		}
		db.AddStock(item.ID, item.Qty)
		itemReceived = append(itemReceived, model.ItemReceivedC{ID: ObjectID, Qty: item.Qty})
	}

	item := model.RecevieInputConvertedChild{
		CreatedBy:    input.CreatedBy,
		Description:  input.Description,
		ItemReceived: itemReceived,
	}
	res, err := collection.InsertOne(ctx, item)
	if err != nil {
		log.Fatal(err)
	}
	userObjectID, err := primitive.ObjectIDFromHex(input.CreatedBy)
	collectionUser := db.client.Database(DBName).Collection("users").FindOne(ctx, bson.M{"_id": userObjectID})

	if err != nil {
		log.Fatal(err)
	}

	var Title string = "New Received added"
	var Body string = "New item added :"

	// range over ItemReceived
	for index, item := range input.ItemReceived {
		currentItem := db.FindItemByID(item.ID)
		Body = Body + fmt.Sprintf("%d", index+1) + ". " + currentItem.Name + " with quantity \n" + fmt.Sprintf("(%d)", item.Qty) + "."
	}

	user := model.User{}
	collectionUser.Decode(&user)
	service.SendEmail(user.Email, Title, Body)

	return &model.Receive{
		ID:           res.InsertedID.(primitive.ObjectID).Hex(),
		CreatedBy:    input.CreatedBy,
		Description:  input.Description,
		ItemReceived: itemReceived,
	}

}

func (db *DB) Receives() []*model.Receives {
	collection := db.client.Database(DBName).Collection("Receive")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	showLoadedCursor, err := collection.Aggregate(ctx, mongo.Pipeline{})
	if err != nil {
		log.Fatal(err)
	}
	var Receives []*model.Receives
	for showLoadedCursor.Next(ctx) {
		var Receive model.Receives
		showLoadedCursor.Decode(&Receive)
		Receive.CreatedBy = db.ResolveCreatedBy(Receive.CreatedBy)

		var itemReceived []model.ItemReceived
		for _, item := range Receive.ItemReceived {
			item.Name = db.ResolveItemName(item.ID)
			itemReceived = append(itemReceived, item)

		}
		Receive.ItemReceived = itemReceived
		Receives = append(Receives, &Receive)
	}
	return Receives

}

func (db *DB) ResolveCreatedBy(ID string) string {
	ObjectID, err := primitive.ObjectIDFromHex(ID)
	if err != nil {
		log.Fatal(err)
	}
	collection := db.client.Database(DBName).Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	//lookup item and user by _id
	res := collection.FindOne(ctx, bson.M{"_id": ObjectID})
	var user model.User
	res.Decode(&user)
	if (user.Name) == "" {
		return "Not Found"
	}
	return user.Name
}

func (db *DB) ResolveItemName(ID string) string {
	collection := db.client.Database(DBName).Collection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	/// ID to objectId
	ObjectID, err := primitive.ObjectIDFromHex(ID)
	if err != nil {
		log.Fatal(err)
	}
	res := collection.FindOne(ctx, bson.M{"_id": ObjectID})
	var item model.Item
	res.Decode(&item)
	return item.Name

}
