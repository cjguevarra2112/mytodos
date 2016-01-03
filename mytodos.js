Todos = new Mongo.Collection("todos");
Lists = new Mongo.Collection("lists");

if(Meteor.isClient) {
	/* Todos */
	Template.mytodos.helpers({
		'todo': function() {
			var currentList = this._id;
			var currentUser = Meteor.userId();
			return Todos.find({listId: currentList, createdBy: currentUser}, {sort: {createdAt: -1}});
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
			var currentUser = Meteor.userId();

			Todos.insert({
				name: taskName,
				completed: false,
				createdAt: new Date(),
				createdBy: currentUser,
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
			var currentUser = Meteor.userId();
			return Lists.find({createdBy: currentUser}, {sort: {name: 1}});
		},
		'activeList': function() {
			var listId = this._id;
			// var currentList = Iron.Location.get().path.split("/").pop();
			var currentList = Router.current().params._id;

			return listId == currentList ? "active" : "";
		}
	});
	/* END Lists */

	/* Add List */
	Template.addList.events({
		'submit form': function(event) {
			event.preventDefault();

			var listName = $("[name=listName]").val();
			var currentUser = Meteor.userId();

			Lists.insert({
				'name': listName,
				'createdBy': currentUser
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

	Template.navigation.events({
		'click .logout': function(event) {
			event.preventDefault();
			Meteor.logout();
			Router.go("login");
		}
	});
	/* END NAVIGATION */



	/* REGISTER */
	Template.register.events({
		'submit form': function(event) {
			event.preventDefault();

			var email = $("[name=email]").val();
			var password = $("[name=password]").val();

			Accounts.createUser({
				email: email,
				password: password
			}, function(error) {
				if (error) {
					alert(error.reason);
				} else {
					Router.go("home");
				}
			});
		}
	});
	/* END REGISTER */

	/* LOGIN */
	Template.login.events({
		'submit form': function(event) {
			event.preventDefault();

			var email = $("[name=email]").val();
			var password = $("[name=password]").val();

			Meteor.loginWithPassword(email, password, function(error) {
				if (error) {
					alert(error);
				}
			});
			$("[name=email]").val("");
			$("[name=password]").val("");

		}
	});

	/* END LOGIN */

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
