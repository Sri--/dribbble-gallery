//Dribbble Gallery App using Backboned/jQuery/Underscore
$(function(){
	//Global variables
	var app;
	var scrollDiv = document.getElementById('page-right');
	//Click event attached to gallery options
	//Also initializes MainView depending on option selected
	$('.btn-mode').click(function(event){
		var $target = $(event.target);
		var $selected = $('.sel-mode');
		if($target.attr('id') == $selected.attr('id')){

		}else{
			$selected.removeClass().addClass("btn-mode");
			$target.removeClass().addClass("sel-mode");
			scrollDiv.scrollTop = 0;
			app = new MainView;		
		}
	});

	//Inifinite Scroll for gallery div
	$('#page-right').scroll(function () { 
		var a = scrollDiv.scrollTop; var b = scrollDiv.scrollHeight - scrollDiv.clientHeight; var c  =  a / b;
		if(c > 0.99){
			app.loadMore();
		}
	});

	//Backbone Models
	var ShotModel = Backbone.Model.extend({
	});
	var CommentModel = Backbone.Model.extend({
	});

	//Backbone Collections
	var PopularList = Backbone.Collection.extend({
		model: ShotModel,
		page: 1,
		initialize: function(){
			this.fetch( {reset: true} );
		},
		url: function(){
			return "http://api.dribbble.com/shots/popular";
		},
		sync: function(method, model, options) {
			var params = _.extend({
			  type:         'GET',
			  dataType:     'jsonp',
			  url:			this.url()+"?per_page=9&page="+encodeURI(this.page)+"&callback=?",
			  jsonp: 		this.parse, 
			  processData:  false
			}, options);
			return $.ajax(params);
		},
		parse: function(response){
			if(response && response.shots.length > 0){
				this.page = parseInt(response.page) + 1;
				return response.shots;
			}
		}
	});

	var DebutList = Backbone.Collection.extend({
		model: ShotModel,
		page: 1,
		initialize: function(){
			this.fetch( {reset: true} );
		},
		url: function(){
			return "http://api.dribbble.com/shots/debuts";
		},
		sync: function(method, model, options) {
			var params = _.extend({
			  type:         'GET',
			  dataType:     'jsonp',
			  url:			this.url()+"?page="+encodeURI(this.page)+"?per_page=9&callback=?",
			  jsonp: 		this.parse, 
			  processData:  false
			}, options);
			return $.ajax(params);
		},
		parse: function(response){
			if(response && response.shots.length > 0){
				this.page = parseInt(response.page) + 1;
				return response.shots;
			}
		}
	});

	var EveryoneList = Backbone.Collection.extend({
		model: ShotModel,
		page: 1,
		initialize: function(){
			this.fetch( {reset: true} );
		},
		url: function(){
			return "http://api.dribbble.com/shots/everyone";
		},
		sync: function(method, model, options) {
			var params = _.extend({
			  type:         'GET',
			  dataType:     'jsonp',
			  url:			this.url()+"?page="+encodeURI(this.page)+"&per_page=9&callback=?",
			  jsonp: 		this.parse,
			  processData:  false
			}, options);
			return $.ajax(params);
		},
		parse: function(response){
			if(response && response.shots.length > 0){
				//console.log("EVERYONE",response);
				this.page = parseInt(response.page) + 1;
				return response.shots;
			}
		}
	});

	//Backbone Views
	var MainView = Backbone.View.extend({
		el: $('div#page-right-gallery'),
		initialize: function(){
			var $selected = $('.sel-mode').attr('id');
			if($selected){
				this.loadData($selected);
			}else{
				alert("Please pick a gallery list");
			}
		},
		events: {
	        "click .shot-tile": "info"
	    },
	    loadData: function(selected){
			switch(selected){
				case "popular":
						this.collection = pop;
						this.render(1);
					break;
				case "debuts":
						this.collection = deb;
						this.render(1);
					break;
				case "everyone":
						this.collection = eve;
						this.render(1);
					break;
				default:
					alert("Connection to server not established");
			}
	    },
	    loadMore: function(){
	    	console.log("LoadMore");
	    	this.collection.fetch({reset: true});
	    	this.collection.bind('reset', function(){
				//this.collection = pop;
				this.render(2);
				}, this);
	    },
	    render: function(mode){
	    	var shot = _.template($("#shot_template").html());
	    	var load = _.template($("#load_template").html());

	    	switch(mode){
	    		case 1:
	    			$(this.el).html("");
					this.collection.each(function(model) {
	            		$(this.el).append(shot(model.attributes));
	        		}, this);
					break;
				case 2:
					$("#page-right-load").remove();
	    			this.collection.each(function(model) {
	            		$(this.el).append(shot(model.attributes));
	        		}, this);
					break;		
	    	}
			$(this.el).append(load);
	    },
	    info: function(event){
	    	var $target = $(event.target);
	    	var model = {
	    		title: $target.attr('title'),
	    		player:{name: $target.attr('data-player')},
	    		views_count: $target.attr('data-views'),
	    		likes_count: $target.attr('data-likes'),
	    		comments_count: $target.attr('data-comments'),
	    		created_at: $target.attr('data-time')
	    	};
	    	var iView = new InfoView(model);
	    }
	});

	var InfoView = Backbone.View.extend({
		el: $('div#page-left-info'),
		initialize: function(model){
			this.render(model);
		},
		render: function(model){
	    	var template = _.template($("#info_template").html());
	    	$(this.el).html(template(model));
		}
	});

	//Loading all the data up front as per challenge instructions
	//Global variables
	var pop = new PopularList;
	var deb = new DebutList;
	var eve = new EveryoneList;
});

/* Dynamic assignment of this.collection and fetching data
			switch(selected){
				case "popular":
					Collection = new PopularList;
					break;
				case "debuts":
					Collection = new DebutList;
					break;
				case "everyone":
					Collection = new EveryoneList;
					break;
				default:
					Collection = this.collection;
			}
*/

/* Future Comment View
	var CommentView = Backbone.View.extend({
		el: $('div#page-left-comments'),
		initialize: function(model){
			this.render(model);
		},
		render: function(model){

		}
	});
*/

/* Future Comment Collection/Model
	var CommentList = Backbone.Collection.extend({
		model: CommentModel,
		page: 1,
		initialize: function(){
			this.fetch( {reset: true} );
		},
		url: function(){
			return "http://api.dribbble.com/shots/everyone";
		},
		sync: function(method, model, options) {
			var params = _.extend({
			  type:         'GET',
			  dataType:     'jsonp',
			  url:			this.url()+"?page="+encodeURI(this.page)+"?per_page=9&callback=?",
			  jsonp: 		this.parse, 
			  processData:  false
			}, options);
			return $.ajax(params);
		},
		parse: function(response){
			if(response && response.shots.length > 0){
				this.page = parseInt(response.page) + 1;
				return response.shots;
			}
		}
	});
	*/