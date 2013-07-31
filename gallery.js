//Dribbble Gallery App using Backboned/jQuery/Underscore
var app;
$(function(){
	//Global variables
	var scrollDiv = document.getElementById('page-right');
	var scrolled = 0;
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
			console.log("NEW VIEW");
			app = new MainView;		
		}
	});

	//Inifinite Scroll for gallery div
	$('#page-right').scroll(function () { 
		var a = scrollDiv.scrollTop; var b = scrollDiv.scrollHeight - scrollDiv.clientHeight; var c  =  a / b;
		if(c > 0.99 && (scrolled == 0) ){
			scrollDiv.scrollTop = 0.7 * b;
			app.loadMore();
		}
		else if(c > 0.99 && (a - scrolled) > 50){
			scrollDiv.scrollTop = 0.7 * b;
			app.loadMore();
		}
		scrolled = parseInt(a);
	});

	//Backbone Models
	var CommentModel = Backbone.Model.extend({

	});

	//Backbone Collections
	var PopularList = Backbone.Collection.extend({
		initialize: function(){
			this.page = 1;
			this.fetch( {reset: true} );
		},
		url: function(){
			return "http://api.dribbble.com/shots/popular";
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
				this.page += 1;
				return response.shots;
			}
		}
	});

	var DebutList = Backbone.Collection.extend({
		initialize: function(){
			this.page = 1;
			this.fetch( {reset: true} );
		},
		url: function(){
			return "http://api.dribbble.com/shots/debuts";
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
				this.page += 1;
				return response.shots;
			}
		}
	});

	var EveryoneList = Backbone.Collection.extend({
		initialize: function(){
			this.page = 1;
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
				this.page += 1;
				return response.shots;
			}
		}
	});

	var CommentList = Backbone.Collection.extend({
		//model: CommentModel,
		initialize: function(shot){
			this.page = 1;
			this.shot = shot.id;
			this.fetch( {reset: true} );
		},
		url: function(){
			return "http://api.dribbble.com/shots/";
		},
		sync: function(method, models, options) {
			var params = _.extend({
			  type:         'GET',
			  dataType:     'jsonp',
			  url:			this.url()+encodeURI(this.shot)+"\/comments?page="+encodeURI(this.page)+"&per_page=5&callback=?",
			  jsonp: 		this.parse, 
			  processData:  false
			}, options);
			return $.ajax(params);
		},
		parse: function(response){
			if(response){
				this.page = parseInt(response.page) + 1;
				return response.comments;
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
					console.log(this.collection);
	    			this.collection.each(function(model) {
	            		$(this.el).append(shot(model.attributes));
	        		}, this);
					break;
				default:
					alert("Loading failed! Please check your connection.");
	    	}
			$(this.el).append(load);
	    },
	    info: function(event){
	    	var $target = $(event.target);
	    	var $shot_selected = $target.parents("div.shot-tile").find('div.shot-img img');
	    	var model = {
	    		id: $shot_selected.attr('id'),
	    		title: $shot_selected.attr('title'),
	    		player:{name: $shot_selected.attr('data-player')},
	    		views_count: $shot_selected.attr('data-views'),
	    		likes_count: $shot_selected.attr('data-likes'),
	    		comments_count: $shot_selected.attr('data-comments'),
	    		created_at: $shot_selected.attr('data-time')
	    	};
	    	var iView = new InfoView(model);
	    	var cList = new CommentList({id: model.id});
	    	cList.bind('reset', function(){
				//this.collection = pop;
				var cView = new CommentView(cList);
				});
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

	var CommentView = Backbone.View.extend({
		el: $('div#page-left-comments'),
		initialize: function(collection){
			this.collection = collection;
			this.render();
		},
		render: function(){
			var comment = _.template($("#comment_template").html());
			$(this.el).html("");
			this.collection.each(function(model) {
	            $(this.el).append(comment(model.attributes));
	        }, this);
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
	
	*/
