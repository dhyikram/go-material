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

func (db *DB) CreateIssue(input model.NewIssues) *model.Issue {
	collection := db.client.Database(DBName).Collection("Issues")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	input.Status = "Pending"
	res, err := collection.InsertOne(ctx, input)
	if err != nil {
		log.Fatal(err)
	}
	return &model.Issue{
		ID:        res.InsertedID.(primitive.ObjectID).Hex(),
		CreatedBy: input.CreatedBy,
	}
}

func (db *DB) ProcessIssue(input model.ProcessIssue) *model.Issue {
	collection := db.client.Database(DBName).Collection("Issues")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	ObjectID, err := primitive.ObjectIDFromHex(input.ID)
	if err != nil {
		log.Fatal(err)
	}
	update := collection.FindOneAndUpdate(ctx, bson.M{"_id": ObjectID}, bson.M{"$set": bson.M{"status": input.Status}})
	var issue model.Issue
	err = update.Decode(&issue)
	if err != nil {
		log.Fatal(err)
	}
	if input.Status == "Approved" {
		for _, requestedItem := range issue.RequestedItem {
			db.AddStock(requestedItem.ID, -requestedItem.Qty)
		}
	}
	return &issue
}

func (db *DB) Issues() []*model.Issue {
	collection := db.client.Database(DBName).Collection("Issues")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	showLoadedCursor, err := collection.Aggregate(ctx, mongo.Pipeline{})
	if err != nil {
		log.Fatal(err)
	}
	var issues []*model.Issue
	for showLoadedCursor.Next(ctx) {
		var Issue model.Issue
		showLoadedCursor.Decode(&Issue)
		// range over requested item
		for index, requestedItem := range Issue.RequestedItem {
			// get item from database
			item := db.FindItemByID(requestedItem.ID)
			Issue.RequestedItem[index].Name = item.Name
		}
		// decodeItemName := db.FindItemByID(Issue.RequestedItem[0].ID)
		Issue.CreatedBy = db.ResolveCreatedBy(Issue.CreatedBy)
		issues = append(issues, &Issue)
	}
	return issues
	// return Receives

}
