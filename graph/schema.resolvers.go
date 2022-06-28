package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/dhyikram/go-material/database"
	"github.com/dhyikram/go-material/graph/generated"
	"github.com/dhyikram/go-material/graph/model"
)

func (r *authOpsResolver) Login(ctx context.Context, obj *model.AuthOps, input model.CredsLogin) (interface{}, error) {
	return db.Login(input)
}

func (r *authOpsResolver) Register(ctx context.Context, obj *model.AuthOps, input model.NewUser) (interface{}, error) {
	return db.CreateUser(input), nil
}

func (r *mutationResolver) CreateItem(ctx context.Context, input model.NewItem) (*model.Item, error) {
	return db.SaveItem(input), nil
}

func (r *mutationResolver) DeleteItem(ctx context.Context, id string) (*bool, error) {
	return db.DeleteItem(id), nil
}

func (r *mutationResolver) CreateIssue(ctx context.Context, input model.NewIssues) (*model.Issue, error) {
	return db.CreateIssue(input), nil
}

func (r *mutationResolver) CreateReceive(ctx context.Context, input model.ReceiveInput) (*model.Receive, error) {
	return db.CreateReceive(input), nil
	// return db.CreateIssue(input), nil
}

func (r *mutationResolver) ProcessIssue(ctx context.Context, input model.ProcessIssue) (*model.Issue, error) {
	return db.ProcessIssue(input), nil

	// return db.CreateReceive(input), nil
	// return db.CreateIssue(input), nil
}

func (r *mutationResolver) Auth(ctx context.Context) (*model.AuthOps, error) {
	return &model.AuthOps{}, nil
}

func (r *queryResolver) Receives(ctx context.Context) ([]*model.Receives, error) {
	return db.Receives(), nil
}

func (r *queryResolver) Receive(ctx context.Context, id string) (*model.Receive, error) {
	return nil, nil
}

func (r *queryResolver) Issues(ctx context.Context) ([]*model.Issue, error) {
	return db.Issues(), nil
	// return db.FindItem(), nil
}

func (r *queryResolver) Issue(ctx context.Context, id string) (*model.Issue, error) {
	panic("Not Implemented Issue")
}

func (r *queryResolver) Items(ctx context.Context) ([]*model.Item, error) {
	return db.FindItem(), nil
}

func (r *queryResolver) Item(ctx context.Context, id string) (*model.Item, error) {
	return db.FindItemByID(id), nil
}

func (r *ReceiveResolver) ItemReceived(ctx context.Context, obj *model.Receive) ([]*model.ItemReceived, error) {
	return nil, nil
}

func (r *ReceivesResolver) ID(ctx context.Context, obj *model.Receives) (string, error) {
	return obj.ID.Hex(), nil
}

func (r *ReceivesResolver) CreatedBy(ctx context.Context, obj *model.Receives) (string, error) {
	return db.ResolveCreatedBy(obj.CreatedBy), nil
}

func (r *ReceivesResolver) ItemReceived(ctx context.Context, obj *model.Receives) ([]model.ItemReceived, error) {
	return nil, nil
}

// AuthOps returns generated.AuthOpsResolver implementation.
func (r *Resolver) AuthOps() generated.AuthOpsResolver { return &authOpsResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

func (r *Resolver) Receive() generated.ReceiveResolver   { return &ReceiveResolver{r} }
func (r *Resolver) Receives() generated.ReceivesResolver { return &ReceivesResolver{r} }

// Receive returns generated.ReceiveResolver implementation.

type authOpsResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type ReceiveResolver struct{ *Resolver }
type ReceivesResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *queryResolver) issue(ctx context.Context, id string) (*model.Issue, error) {
	panic("Not Implemented")
	// return db.FindItem(), nil
}

var db = database.Connect()

type itemsResolver struct{ *Resolver }
