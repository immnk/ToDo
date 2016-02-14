var app = {

    pageParam: {},
    
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        storageService = new StorageService();
        storageService.initialize().done(function () {
            console.log("Service initialized");
        });
        app.loadTaskList();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
        $( ":mobile-pagecontainer" ).on( "swiperight", app.swiperightHandler );
        $( ":mobile-pagecontainer" ).on( "swipeleft", '.listButton', app.deleteTask);
        $( ":mobile-pagecontainer" ).on( "swipeleft", app.swipeleftHandler );
        $("#saveButton").click(app.saveToDoObj);
        $("#menuButton").click(app.swiperightHandler);
        $("#addButton").click(app.addPageNavigate);
        $("#menuList").listview().listview('refresh');
        $("body").click(app.closeMenu);
        $(":mobile-pagecontainer").on('change','.checkboxClass',app.checkboxChanged);
        $(":mobile-pagecontainer").on('click', '.taskData', app.viewPageNavigate);
        $(":mobile-pagecontainer").on('click', '#completedButton', app.viewCompletedTasks);
        $(":mobile-pagecontainer").on('click', '#showAllButton', app.loadTaskList);
        $(":mobile-pagecontainer").on('click', '#pendingButton', app.viewPendingTasks);
        // $(".listButton").on('swipeleft',app.deleteTask);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        // app.receivedEvent('deviceready');
        // app.loadTaskList(); // This is done in initialize itself.
        // navigator.splashscreen.show();
    },
    swiperightHandler: function(){
        console.log('swiped right');
        $("#menuPane").animate({left:'0px'}, 100);
    },
    swipeleftHandler: function(){
        console.log('swiped left');
        $("#menuPane").animate({left:'-200px'}, 100);
    },
    onBackKeyDown: function(){
        if($.mobile.activePage.is('#mainPage')){
            navigator.app.exitApp();
        }
        else {
            app.pageParam = {};
            app.loadTaskList();
            navigator.app.backHistory();
        }
    },
    saveToDoObj: function(){
        var toDoObj = {};
        toDoObj.title = $("#titleBox").val();
        toDoObj.description = $("#descriptionBox").val();
        toDoObj.date = $("#dateBox").val();
        toDoObj.isCompleted = $("#iscompCheckBox").prop("checked");
        if(app.pageParam.id != undefined){
            toDoObj.id = app.pageParam.id;
        }

        console.log(toDoObj);
        storageService.addTask(toDoObj).done(function(status){
            console.log("saved: "+status);
            app.goToAnotherPage("#mainPage");
            app.loadTaskList();
        });
    },
    addPageNavigate:function(){
        app.pageParam= {};
        app.clearAddPage();
        app.goToAnotherPage("#addPage");
    },
    viewPageNavigate: function(e){
        // console.log(e);
        // console.log(e.target);
        // if(e.target == "input"){
        //     console.log('stop the event bubble...');
        // }
        console.log('clicked task id = '+$(this).attr('id'));
        var clickedItemId= $(this).attr('id');
        storageService.getTaskById(clickedItemId).done(function(task){
            app.pageParam.id = clickedItemId;
            app.pageParam.title = task.title;
            app.pageParam.description=task.description;
            app.pageParam.date=task.date;
            app.pageParam.isCompleted=task.isCompleted;
            app.fillAddPage();

            // $("#titleBox").val(task.title);
            // $("#descriptionBox").val(task.description);
            // $("#dateBox").val(task.date);
            // $("#iscompCheckBox").prop("checked", task.isCompleted).checkboxradio().checkboxradio('refresh');
        });
        app.goToAnotherPage("#addPage");
    },
    goToAnotherPage: function(pageNameSelector){
        $.mobile.changePage(pageNameSelector,"flip");
    },
    closeMenu: function(){
        if($("#menuPane").css('left') == "0px")
            app.swipeleftHandler();
    },
    checkboxChanged: function(event){
        // event.stopPropagation();
        console.log(event);
        console.log('clicked task id = '+$(this).attr('id'));
        console.log('checkbox changed...');
        try{
            var taskId = $(this).attr('id').split("-")[1];
            if(taskId!=undefined){
                var checkboxState = ( $(this).is(':checked') ) ? true : false; 
                storageService.markTaskChanged(taskId, checkboxState).done(function(isSuccess){
                    console.log("mark changed: "+isSuccess);
                });
            }
        }catch(err){
            alert(err);
        }
    },
    clearAddPage: function(){
        $("#titleBox").val("");
        $("#descriptionBox").val("");
        $("#dateBox").val("");
        $("#iscompCheckBox").prop("checked", "false").checkboxradio().checkboxradio('refresh');
    },
    fillAddPage: function(){
        var task = app.pageParam;
        $("#titleBox").val(task.title);
        $("#descriptionBox").val(task.description);
        $("#dateBox").val(task.date);
        $("#iscompCheckBox").prop("checked", task.isCompleted).checkboxradio().checkboxradio('refresh');
    },
    deleteTask: function(event){
        event.stopPropagation();
        var taskId = $(this).attr('id').split("-")[1];
        if(taskId!=undefined){
            storageService.deleteTask(taskId).done(function(response){
                console.log("delete task: "+response);
                app.loadTaskList();
            });
        }
    },
    viewCompletedTasks: function(){
        storageService.getCompletedTasks().done(function(allTasks){
            console.log('Tasks completed: ' + allTasks);
            app.loadListView(allTasks);
        });
    },
    viewPendingTasks: function(){
        storageService.getPendingTasks().done(function(allTasks){
            console.log('Tasks pending: ' + allTasks);
            app.loadListView(allTasks);
        });
    },
    loadTaskList: function(){
        storageService.getAllTasks().done(function(allTasks){
            console.log('Tasks stored: ' + allTasks);
            if(allTasks!=null)
                app.loadListView(allTasks);
        });
    },
    loadListView: function(allTasks){
        var myTasksList = $("#tasksList").empty();
        if(allTasks.length > 0){            
            for (var i = allTasks.length - 1; i >= 0; i--) {
                var task = allTasks[i];
                console.log(task);
                var listString = "<li data-icon='info'>"+
                        "<a class='listButton'>"+
                            "<h2>"+task.title+"</h2>"+
                            "<p>"+task.description+"</p>"+
                            "<p class='ui-li-aside'>"+task.date+"</p>"+
                        "</a>"+
                    "</li>";
                var listString2_1="<li data-icon='info'>"+
                        "<a class='listButton' id='anchorButton-"+task.id+"' >"+
                        "<div class='checkbox'>"+
                            "<label><input type='checkbox' name='checkbox1' class='checkboxClass' id='listButton-"+
                            task.id+"' ";
                var listString2_concat = (task.isCompleted == true) ? "checked" : "";
                var listString2_2="></label>"+
                        "</div>"+
                        "<div class='taskData' id='"+task.id+"' >"+
                            "<h2 style='text-transform:capitalize; margin: 10px 0 0 0px'>"+
                            task.title+"</h2>"+
                            "<div style='text-transform:capitalize; font-weight: normal; margin: 10px 0 0 10px;'>"+
                            task.description+"</div>"+
                            "<div style='margin: 10px 0 0 0px; font-weight: normal; font-style: italic;'>"+
                            task.date+"</div>"+
                        "</div>"+
                        "</a>"+
                    "</li>";
                var listString2 = listString2_1+listString2_concat+listString2_2;
                myTasksList.append(listString2);
            }
            $(".checkboxClass").checkboxradio().checkboxradio('refresh');                
            myTasksList.listview().listview('refresh').trigger("create");
        } else{
            console.log("No tasks to display...!");
        }
    }
};
$(document).ready(function(){
    app.initialize();
    var storageService;
});