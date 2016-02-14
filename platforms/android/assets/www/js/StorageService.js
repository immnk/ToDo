var StorageService = function(){

	this.initialize = function() {
        // No Initialization required
        var deferred = $.Deferred();
        console.log('Initializing storage service... Please wait...');
        deferred.resolve();
        return deferred.promise();
    }

    this.addTask = function(taskObj){
    	var deferred = $.Deferred();
    	this.getAllTasks().done(function(allTasks){
    		try{
    			if(taskObj.id != undefined){
	    			var data = $.grep(allTasks, function(e){ 
					    return e.id != taskObj.id;
					});
					data.push(taskObj);
					var allTasksStr = JSON.stringify(data);
					localStorage.setItem("items",allTasksStr);
					deferred.resolve(true);
	    		} else{
		    		taskObj.id = allTasks.length + 1 ;
		    		allTasks.push(taskObj);
		    		this.tasks=allTasks;
		    		var allTasksStr = JSON.stringify(allTasks);
					localStorage.setItem("items",allTasksStr);
					deferred.resolve(true);
				}
    		}
    		catch(err){
    			deferred.resolve(false);
    		}
    	});
    	return deferred.promise();
    }

    this.editTask = function(taskObj){
    	var deferred = $.Deferred();
    	this.getAllTasks().done(function(allTasks){
    		var data = $.grep(allTasks, function(e){ 
			    return e.id != taskObj.id;
			});
			data.push(taskObj);
			var allTasksStr = JSON.stringify(data);
			localStorage.setItem("items",allTasksStr);
			deferred.resolve(true);
    	});
    	return deferred.promise();
    }

	this.deleteTask = function(id){
		var deferred = $.Deferred();
    	this.getAllTasks().done(function(allTasks){
    		var data = $.grep(allTasks, function(e){ 
			    return e.id != id;
			});
			var allTasksStr = JSON.stringify(data);
			localStorage.setItem("items",allTasksStr);
			deferred.resolve(true);
    	});
    	return deferred.promise();
    }
    
    this.getAllTasks = function(){
    	var deferred = $.Deferred();
    	var allTasksStr= localStorage.getItem("items");
		this.tasks = JSON.parse(allTasksStr);
		if(this.tasks!=undefined){
			this.tasks.sort(function(a , b){
				return new Date(a.date) - new Date(b.date);
			});
		}else{
			this.tasks = [];
		}
		deferred.resolve(this.tasks);
        return deferred.promise();
    }

    this.getCompletedTasks = function(){
    	var deferred = $.Deferred();
    	this.getAllTasks().done(function(allTasks){
    		var completedTasks = [];
    		$.each(allTasks, function(index, task){
    			if(task.isCompleted == true){
    				completedTasks.push(task);
    			}
    		});
    		console.log(completedTasks);
    		deferred.resolve(completedTasks);
    	});
    	return deferred.promise();
    }

    this.getPendingTasks = function(){
    	var deferred = $.Deferred();
    	this.getAllTasks().done(function(allTasks){
    		var completedTasks = [];
    		$.each(allTasks, function(index, task){
    			if(task.isCompleted == false){
    				completedTasks.push(task);
    			}
    		});
    		console.log(completedTasks);
    		deferred.resolve(completedTasks);
    	});
    	return deferred.promise();
    }

    this.getTaskById = function(id){
    	var deferred = $.Deferred();
    	this.getAllTasks().done(function(allTasks){
    		var myTask = "";
    		$.each(allTasks, function(index, task){
    			if(task.id == id){
    				myTask = task;
    				return false;
    			}
    		});
    		console.log(myTask);
    		deferred.resolve(myTask);
    	});
    	return deferred.promise();
    }

    this.markTaskChanged = function(id, changedValue){
    	var deferred = $.Deferred();
    	this.getAllTasks().done(function(allTasks){
    		var myTask = "";
    		var isSuccess = false;
    		$.each(allTasks, function(index, task){
    			if(task.id == id){
    				myTask = task;
    				return false;
    			}
    		});
    		if(myTask!='undefined'){
    			myTask.isCompleted = changedValue;
    			var data = $.grep(allTasks, function(e){ 
				    return e.id != myTask.id;
				});
				data.push(myTask);
				var allTasksStr = JSON.stringify(data);
				localStorage.setItem("items",allTasksStr);
				isSuccess = true;
    		}
    		deferred.resolve(isSuccess);
    	});
    	return deferred.promise();
    }

    var tasks = [];
	// var arr = [];
	// var toDoObj = {};
	// toDoObj.title = "Hello";
	// toDoObj.description = "This is me!";
	// toDoObj.duedate = "2015-09-02";
	// toDoObj.isCompleted = "on";
	// arr.push(toDoObj);

	// var arrStr = JSON.stringify(arr);
	// localStorage.setItem("items",arrStr);
	// x= localStorage.getItem("items");
	// var tem = JSON.parse(x);
	//Stop loading animation on success
    // $.mobile.pageLoading( true );
}