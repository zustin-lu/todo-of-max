// main.go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"
	"todo-list-be/todolib"
)

var todoStore *todolib.TodoStore

func init() {
	todoStore = todolib.NewTodoStore()
}

func createTodoHandler(w http.ResponseWriter, r *http.Request) {
	var todo todolib.Todo
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	todo.Date = time.Now()
	todoID := todoStore.Create(todo)
	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, "{\"id\": %d}", todoID)
}

func getTodoHandler(w http.ResponseWriter, r *http.Request) {
	idParam := r.URL.Query().Get("id")
	if idParam == "" {
		http.Error(w, "Missing 'id' parameter.", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid 'id' parameter", http.StatusBadRequest)
		return
	}

	todo, exists := todoStore.Read(id)
	if !exists {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(todo)
}

func toggleComplete(w http.ResponseWriter, r *http.Request) {
	idParam := r.URL.Query().Get("id")
	if idParam == "" {
		http.Error(w, "Missing 'id' parameter", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid 'id' parameter", http.StatusBadRequest)
		return
	}

	todo, exists := todoStore.Read(id)
	if !exists {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	todo.Completed = !todo.Completed

	if !todoStore.Update(id, todo) {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func deleteTodoHandler(w http.ResponseWriter, r *http.Request) {
	idParam := r.URL.Query().Get("id")
	if idParam == "" {
		http.Error(w, "Missing 'id' parameter", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid 'id' parameter", http.StatusBadRequest)
		return
	}

	if !todoStore.Delete(id) {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func listTodosHandler(w http.ResponseWriter, r *http.Request) {
	todos := todoStore.List()
	json.NewEncoder(w).Encode(todos)
}

func CORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Credentials", "true")
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		w.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")

		if r.Method == "OPTIONS" {
			http.Error(w, "No Content", http.StatusNoContent)
			return
		}

		next(w, r)
	}
}

func singleTodoHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		createTodoHandler(w, r)
	case http.MethodGet:
		getTodoHandler(w, r)
	case http.MethodPut:
		toggleComplete(w, r)
	case http.MethodDelete:
		deleteTodoHandler(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getTodoListHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		listTodosHandler(w, r)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func main() {
	http.HandleFunc("/api/todo", CORS(singleTodoHandler))

	http.HandleFunc("/api/todos", CORS(getTodoListHandler))

	fmt.Println("Server listening on port 8080")
	http.ListenAndServe(":8080", nil)
}
