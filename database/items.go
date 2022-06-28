package database

import (
	"context"
	"log"
	"time"

	"github.com/dhyikram/go-material/graph/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func (db *DB) SaveItem(input model.NewItem) *model.Item {
	collection := db.client.Database(DBName).Collection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// convert input.Required to mongodb ObjectID
	var requires []model.CustomRequires
	for _, require := range input.Requires {
		ObjectID, err := primitive.ObjectIDFromHex(require.ID)
		if err != nil {
			log.Fatal(err)
		}
		requires = append(requires, model.CustomRequires{ID: ObjectID, Qty: require.Qty})
	}

	item := model.CustomInputItem{
		Name:     input.Name,
		Stock:    input.Stock,
		Category: input.Category,
		Requires: requires,
	}

	res, err := collection.InsertOne(ctx, item)
	if err != nil {
		log.Fatal(err)
	}

	return &model.Item{
		ID:       res.InsertedID.(primitive.ObjectID).Hex(),
		Name:     input.Name,
		Stock:    input.Stock,
		Category: input.Category,
	}

}

func (db *DB) DeleteItem(ID string) *bool {
	ObjectID, err := primitive.ObjectIDFromHex(ID)
	if err != nil {
		log.Fatal(err)
	}
	collection := db.client.Database(DBName).Collection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, error := collection.DeleteOne(ctx, bson.M{"_id": ObjectID})
	if error != nil {
		log.Fatal(err)
	}
	success := new(bool)
	*success = true
	return success
}

func (db *DB) FindItemByID(ID string) *model.Item {
	ObjectID, err := primitive.ObjectIDFromHex(ID)
	if err != nil {
		log.Fatal(err)
	}
	collection := db.client.Database(DBName).Collection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res := collection.FindOne(ctx, bson.M{"_id": ObjectID})
	item := model.Item{}
	res.Decode(&item)
	return &item
}

func (db *DB) GetQtyByFromItems(ItemIDs string, requiresID string) int {
	ObjectIDItem, err := primitive.ObjectIDFromHex(ItemIDs)
	if err != nil {
		log.Fatal(err)
	}
	ObjectIDRequires, err := primitive.ObjectIDFromHex(requiresID)
	if err != nil {
		log.Fatal(err)
	}
	collection := db.client.Database(DBName).Collection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	lookupStage := bson.D{{"$match", bson.D{{"_id", ObjectIDItem}}}}
	lookupStage2 := bson.D{{"$unwind", "$requires"}}
	lookupStage3 := bson.D{{"$match", bson.D{{"requires._id", ObjectIDRequires}}}}
	showLoadedCursor, err := collection.Aggregate(ctx, mongo.Pipeline{lookupStage, lookupStage2, lookupStage3})
	for showLoadedCursor.Next(ctx) {
		var item model.AggretageItem
		showLoadedCursor.Decode(&item)
		return item.Requires.Qty
	}
	return 0
}

func (db *DB) FindItem() []*model.Item {
	collection := db.client.Database(DBName).Collection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	lookupStage := bson.D{{"$lookup", bson.D{{"from", "items"}, {"localField", "requires._id"}, {"foreignField", "_id"}, {"as", "requires"}}}}
	showLoadedCursor, err := collection.Aggregate(ctx, mongo.Pipeline{lookupStage})
	if err != nil {
		log.Fatal(err)
	}

	var items []*model.Item
	for showLoadedCursor.Next(ctx) {
		var item model.Item
		showLoadedCursor.Decode(&item)
		for _, require := range item.Requires {
			require.Qty = db.GetQtyByFromItems(item.ID, require.ID)
		}

		items = append(items, &item)
	}
	return items

}
