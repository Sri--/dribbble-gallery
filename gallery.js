//Dribbble Gallery App using Backboned/jQuery/Underscore
$(function(){
var we;
	//Click event attached to gallery options
	//Also initializes MainView depending on option selected
	$('.btn-mode').click(function(event){
		var $target = $(event.target);
		var $selected = $('.sel-mode');
		if($target.attr('id') == $selected.attr('id')){

		}else{
			$selected.removeClass().addClass("btn-mode");
			$target.removeClass().addClass("sel-mode");
			var app = new MainView;
		}
	});

	//Inifinite Scroll for Gallery Div
	$('#page-right').scroll(function () { 
	   if ($('#page-right').scrollTop() == $(document).height() - $('#page-right').height()) {
	   }
	//console.log($('#page-right').scrollTop() >= 0.3 * $('#page-right').height());
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
			  url:			this.url()+"?per_page=12&callback=?",
			  jsonp: 		this.parse, 
			  processData:  false
			}, options);
			return $.ajax(params);
		},
		parse: function(response){
			if(response && response.shots.length > 0){
				this.page = response.page;
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
			  url:			this.url()+"?per_page=12&callback=?",
			  jsonp: 		this.parse, 
			  processData:  false
			}, options);
			return $.ajax(params);
		},
		parse: function(response){
			if(response && response.shots.length > 0){
				this.page = response.page;
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
			  url:			this.url()+"?page="+encodeURI(this.page)+"&per_page=12&callback=?",
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

	/*
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
			  url:			this.url()+"?per_page=12&callback=?",
			  jsonp: 		this.parse, 
			  processData:  false
			}, options);
			return $.ajax(params);
		},
		parse: function(response){
			if(response && response.shots.length > 0){
				this.page = response.page;
				return response.shots;
			}
		}
	});
	*/

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
	    	var Collection;
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
			Collection.bind('reset', function(){
				this.collection = Collection;
				this.render();
				}, this);
	    },
	    render: function(){
	    	$(this.el).html("");
	    	var template = _.template($("#shot_template").html());
			this.collection.each(function(model) {
            	$(this.el).append(template(model.attributes));
        	}, this);
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

	/*
	var CommentView = Backbone.View.extend({
		el: $('div#page-left-comments'),
		initialize: function(model){
			this.render(model);
		},
		render: function(model){

		}
	});
	*/
});