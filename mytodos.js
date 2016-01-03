Todos = new Mongo.Collection("todos");
Lists = new Mongo.Collection("lists");

if(Meteor.isClient) {
	/* Todos */
	Template.mytodos.helpers({
		'todo': function() {
			var currentList = this._id;
			return Todos.find({listId: currentList}, {sort: {createdAt: -1}});
		}
	});
	/* END Todos */

	/* Todo Items */
	Template.todoItem.helpers({
		'checked': function() {
			return this.completed ? "checked" : "";
		}
	});

	Template.todoItem.events({

		// remove task
		'click .remove-task': function(event) {
			event.preventDefault();
			var taskId = this._id;
			var confirmRemove = window.confirm("Really, delete this task? ");
			if (confirmRemove) {
				Todos.remove({_id: taskId});
			}
		},

		// set task as complete
		'change [type=checkbox]': function() {
			var taskId = this._id;
			var isCompleted = this.completed;
			var updatedStatus = isCompleted ? false : true;
			Todos.update({_id: taskId}, {$set: {completed: updatedStatus}});
		},

		// update task on change
		'keyup [name=taskName]': function(event) {
			if (event.which == 13 || event.which == 37) {
				$(event.target).blur();
			} else {
				var taskId = this._id;
				var updatedName = $(event.target).val();
				Todos.update({_id: taskId}, {$set: {name: updatedName}});
			}
		}
	});
	/* END Todos */

	/* Add Todo */
	Template.addTodo.events({
		'submit form': function(event) {
			event.preventDefault();
			var taskName = $("[name=newTaskName]").val();
			var currentList = this._id;
			Todos.insert({
				name: taskName,
				completed: false,
				createdAt: new Date(),
				listId: currentList
			});
			$("[name=newTaskName]").val("");
		}
	});
	/* END Add Todo */

	/* Todo Count */
	Template.todosCount.helpers({
		'completed': function() {
			var currentList = this._id;
			return Todos.find({listId: currentList, completed: true}).count();
		},
		'total': function() {
			var currentList = this._id;
			return Todos.find({listId: currentList}).count();
		}
	});
	/* END Todo Count */

	/* Lists */
	Template.lists.helpers({
		'list': function() {
			return Lists.find({}, {sort: {name: 1}});
		},
		'activeList': function() {
			var listId = this._id;
			var currentList = Iron.Location.get().path.split("/").pop();

			return listId == currentList ? "active" : "";
		}
	});
	/*
	Template.lists.events({
		'click .list-group-item': function() {
			var currentListId = this._id;
			var name = this.name;
			var currentRouteParam = Iron.Location.get().path;
			console.log(currentRouteParam.split("/").pop());

		}
	});
	*/
	/* END Lists */

	/* Add List */
	Template.addList.events({
		'submit form': function(event) {
			event.preventDefault();

			var listName = $("[name=listName]").val();
			Lists.insert({
				'name': listName
			}, function(error, results){
				var listId = results;
				Router.go("listPage", {_id: listId});
			});
			$("[name=listName]").val("");

		}
	});
	/* END Add List */


	/* NAVIGATION */
	Template.navigation.helpers({
		'activeIfSelected': function(page) {
			var currentPage = Router.current().route.getName();
			return page == currentPage ? "active" : "";
		}
	});
	/* END NAVIGATION */

}

if(Meteor.isServer) {

}


/**************** ROUTING *****************/
Router.configure({
	layoutTemplate: "main"
});

Router.route("/", {
	name: "home",
	template: "home"
});

Router.route("/list/:_id", {
	name: "listPage",
	template:"listPage",
	data: function() {
		var currentList = this.params._id;
		return Lists.findOne({_id: currentList});
	}
});

Router.route("/register");
Router.route("/login");
