Todos = new Mongo.Collection("todos");

if(Meteor.isClient) {
	/* Todos */
	Template.mytodos.helpers({
		'todo': function() {
			return Todos.find({}, {sort: {createdAt: -1}});
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
		'click .remove-task': function(event) {
			event.preventDefault();
			var taskId = this._id;
			var confirmRemove = window.confirm("Really, delete this task? ");
			if (confirmRemove) {
				Todos.remove({_id: taskId});
			}
		},

		'change [type=checkbox]': function() {
			var taskId = this._id;
			var isCompleted = this.completed;
			var updatedStatus = isCompleted ? false : true;
			Todos.update({_id: taskId}, {$set: {completed: updatedStatus}});
		},

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
			var taskName = $("[name=taskName]").val();
			Todos.insert({
				name: taskName,
				completed: false,
				createdAt: new Date()
			});
			$("[name=taskName]").val("");
		}
	});
	/* END Add Todo */

	/* Todo Count */
	Template.todosCount.helpers({
		'completed': function() {
			return Todos.find({completed: true}).count();
		},
		'total': function() {
			return Todos.find().count();
		}
	});
	/* END Todo Count */

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

Router.route("/register");
Router.route("/login");
