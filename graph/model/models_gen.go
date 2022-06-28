// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type AuthOps struct {
	Login    interface{} `json:"login" bson:"login"`
	Register interface{} `json:"register" bson:"register"`
}

type Issue struct {
	ID            string          `json:"id" bson:"_id"`
	CreatedBy     string          `json:"createdBy" bson:"createdBy"`
	Title         string          `json:"title" bson:"title"`
	Description   string          `json:"description" bson:"description"`
	Status        string          `json:"status" bson:"status"`
	RequestedItem []*ItemRequires `json:"requestedItem" bson:"requestedItem"`
}

type Item struct {
	ID            string           `json:"id" bson:"_id"`
	Name          string           `json:"name" bson:"name"`
	Stock         int              `json:"stock" bson:"stock"`
	Category      string           `json:"category" bson:"category"`
	Requires      []*RequestedItem `json:"requires" bson:"requires"`
	RequestedItem []*RequestedItem `json:"RequestedItem" bson:"RequestedItem"`
}

type ItemReceived struct {
	ID   string `json:"id" bson:"_id"`
	Name string `json:"name" bson:"name"`
	Qty  int    `json:"qty" bson:"qty"`
}

type ItemRequire struct {
	ID  string `json:"id" bson:"_id"`
	Qty int    `json:"qty" bson:"qty"`
}

type ItemRequires struct {
	ID   string `json:"id" bson:"_id"`
	Name string `json:"name" bson:"name"`
	Qty  int    `json:"qty" bson:"qty"`
}

type NewIssues struct {
	CreatedBy     string                `json:"createdBy" bson:"createdBy"`
	Title         string                `json:"title" bson:"title"`
	Description   string                `json:"description" bson:"description"`
	Status        string                `json:"status" bson:"status"`
	RequestedItem []*RequestedItemInput `json:"requestedItem" bson:"requestedItem"`
}

type NewItem struct {
	Name     string                `json:"name" bson:"name"`
	Stock    int                   `json:"stock" bson:"stock"`
	Category string                `json:"category" bson:"category"`
	Requires []*RequestedItemInput `json:"requires" bson:"requires"`
}

type NewUser struct {
	Name     string `json:"name" bson:"name"`
	Email    string `json:"email" bson:"email"`
	Password string `json:"password" bson:"password"`
}

type ProcessIssue struct {
	ID     string `json:"id" bson:"_id"`
	Status string `json:"status" bson:"status"`
}

type RequestedItem struct {
	ID   string  `json:"id" bson:"_id"`
	Qty  int     `json:"qty" bson:"qty"`
	Name *string `json:"name" bson:"name"`
}

type RequestedItemInput struct {
	ID  string `json:"id" bson:"_id"`
	Qty int    `json:"qty" bson:"qty"`
}

type User struct {
	ID       string  `json:"id" bson:"_id"`
	Name     string  `json:"name" bson:"name"`
	Email    string  `json:"email" bson:"email"`
	Password *string `json:"password" bson:"password"`
}

type CredsLogin struct {
	Email    string `json:"email" bson:"email"`
	Password string `json:"password" bson:"password"`
}