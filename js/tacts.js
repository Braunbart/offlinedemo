var TACTS = {};

TACTS.init = function() {
    this.contacts = new TACTS.Contacts();
	this.bindEvents();
	this.contacts.generate(); // for demo purposes
	if(window.innerWidth >= 1280) this.selectFirstContact();
};

TACTS.bindEvents = function() {
	$('.close-area').on('click', this.showListView.bind(this));
	$(document).on('click', '.contact', this.showDetailView.bind(this));
	$('.search .input').on('keyup', this.searchList.bind(this));
	$('.js-add').on('click', this.addContact.bind(this.contacts));
	$(document).on('click', '.js-edit', this.editContact.bind(this));
	$(document).on('click', '.js-save', this.saveContact.bind(this));
	$(document).on('click', '.js-delete', this.deleteContact.bind(this));
};

// TODO: popups

TACTS.Contacts = function() {
    this.list = [];
};

TACTS.Contacts.prototype = {
    add: function(contact) {
        this.list.push(contact);
        TACTS.updateList();
    },
    getById: function(id) {
        for(var i=0; i<TACTS.contacts.list.length; i++) {
            if (TACTS.contacts.list[i].id === parseInt(id)) return TACTS.contacts.list[i];
        }
        return;
    },
    generate: function() {
        // From fakenamegenerator.com
        this.add(new TACTS.Contact('Annette M. Dove', '503-464-0105', 'AnnetteMDove@teleworm.us', '1035 Crummit Lane\nOmaha, NE 68102', 'May 12, 1989', 'Foo'));
        this.add(new TACTS.Contact('Beatrice W. Brown', '214-234-1535', 'BeatriceWBrown@dayrep.com', '2513 Haven Lane\nPortland, MI 48875', 'January 15, 1939', 'Bar'));
        this.add(new TACTS.Contact('John L. Burdick', '217-833-3172', 'JohnLBurdick@teleworm.us ', '185 Kincheloe Road\nPortland, OR 97205 ', 'April 24, 1947', 'FooBar'));
    }    
};

TACTS.Contact = function(name, phone, email, address, birthday, notes, avatar) {
    this.id = this.generateId();
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.birthday = birthday;
    this.notes = notes;
    this.avatar = (avatar !== undefined) ? avatar : 'img/avatar.jpg';
};

TACTS.Contact.prototype.generateId = function() {
    var time = new Date().getTime();
    while (time == new Date().getTime());
    return new Date().getTime();
};

TACTS.showListView = function() {
    $('.view-wrapper').attr("data-view", "list-view");
};

TACTS.showDetailView = function(e) {
    $('.contact').removeClass('active');
    $(e.currentTarget).addClass('active');
    $('.view-wrapper').attr("data-view", "detail-view");
    
    var contact = TACTS.contacts.getById($(e.currentTarget).attr('data-id'));
    $('.detail-view').attr('data-id', contact.id);
    var html = '<img class="picture js-avatar" src="' + contact.avatar + '" alt="" />';
    html += '<h1 class="name js-editable js-name">' + contact.name + '</h1>';
    html += '<h2 class="headline">Phone</h2>';
    html += '<p class="text js-editable js-phone">' + contact.phone + '</p>';
    html += '<h2 class="headline">Email</h2>';
    html += '<p class="text js-editable js-email">' + contact.email + '</p>';
    html += '<h2 class="headline">Address</h2>';
    html += '<p class="text js-editable js-address">' + contact.address + '</p>';
    html += '<h2 class="headline">Birthday</h2>';
    html += '<p class="text js-editable js-birthday">' + contact.birthday + '</p>';
    html += '<h2 class="headline">Notes</h2>';
    html += '<p class="text js-editable js-notes">' + contact.notes + '</p>';
    html += '<div class="detail-header">';
    html += '<div class="button-wrap">';
    html += '<button class="button js-edit">Edit</button>';
    html += '<button class="button js-delete">Delete</button>';
    html += '</div>';
    html += '</div>';
    $('.detail-view .content-area').html(html);
};

TACTS.addContact = function() {
    var contact = new TACTS.Contact('', '', '', '', '', '');
    TACTS.contacts.add(contact);
    $('.contact[data-id=' + contact.id + ']').trigger('click');
    $('.js-edit').trigger('click');
    $('.js-name input').focus();
};

TACTS.editContact = function(e) {
    $('.js-editable').each(function() {
        $(this).html('<input type="text" class="input" value="' + $(this).text() + '" />');
    });
    $(e.target).removeClass('js-edit').addClass('js-save').html('Save');
};

TACTS.saveContact = function(e) {
    var contact = TACTS.contacts.getById($('.detail-view').attr('data-id'));
    contact.name = $('.js-name input').val();
    contact.phone = $('.js-phone input').val();
    contact.email = $('.js-email input').val();
    contact.address = $('.js-address input').val();
    contact.birthday = $('.js-birthday input').val();
    contact.notes = $('.js-notes input').val();
    // TODO: avatar
    $(e.target).removeClass('js-save').addClass('js-edit').html('Edit');
    $('.js-editable').each(function() {
        $(this).html($(this).find('input').val());
    });
    TACTS.updateList();  
};

TACTS.deleteContact = function(e) {
    // TODO: confirmation
    var id = $('.detail-view').attr('data-id');
    for(var i=0; i<TACTS.contacts.list.length; i++) {
        if (TACTS.contacts.list[i].id === parseInt(id)) {
            TACTS.contacts.list.splice(i, 1);
        }
    }
    TACTS.updateList();
    TACTS.selectFirstContact();
};

  
TACTS.selectFirstContact = function() {
    if(TACTS.contacts.list.length > 0) {
        $($('.contact')[0]).trigger('click'); 
    } else {
        $('.detail-view .content-area').html('Select a contact from the list to view it\'s details.');
    }
};

TACTS.updateList = function() {
    $('.search .input').val('');
    $('.contact-list').html('');
    for(var i=0; i<TACTS.contacts.list.length; i++) {
        var contact = TACTS.contacts.list[i];
        var contactHtml = '<li class="contact" data-id="' + contact.id + '">';
        contactHtml += '<img class="picture" src="' + contact.avatar + '" alt="" />';
        contactHtml += '<div class="name">' + contact.name + '</div>';
        contactHtml += '</li>';
        $('.contact-list').append(contactHtml);
    }
};

TACTS.searchList = function(e) {
    // TODO: on enter
    var search = $(e.delegateTarget).val().toLowerCase();
	$('.contact').find('em').contents().unwrap().end();
	if($.trim(search) == '') {
		$('.contact').show();
		return;
	}
	$('.contact').hide();
	for(var i=0; i<$('.contact').length; i++) {
		var user = $($('.contact')[i]).find('.name').text().toLowerCase();
		if (user.indexOf(search) != -1){
			$($('.contact')[i]).show();
			var highlighted = $($('.contact')[i]).find('.name').html().substring(0,user.indexOf(search));
				highlighted += "<em class='highlight'>" + $($('.contact')[i]).find('.name').html().substring(user.indexOf(search),user.indexOf(search)+search.length) + "</em>";
				highlighted += $($('.contact')[i]).find('.name').html().substring(user.indexOf(search)+search.length);
			$($('.contact')[i]).find('.name').html(highlighted);
		}
	}
};
