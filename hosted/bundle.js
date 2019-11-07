'use strict';

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $('#domoMessage').animate({ width: 'hide' }, 350);

    if ($('#domoName').val() == '' || $('#domoAge').val() == '') {
        handleError('RAWR! All fields are required');
        return false;
    }

    sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function () {
        loadDomosFromServer();
    });
    return false;
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        'form',
        { id: 'domoForm', onSubmit: handleDomo,
            name: 'domoForm', action: '/maker',
            method: 'POST', className: 'domoForm' },
        React.createElement(
            'label',
            { htmlFor: 'name' },
            'Name: '
        ),
        React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'Domo Name' }),
        React.createElement(
            'label',
            { htmlFor: 'age' },
            'Age: '
        ),
        React.createElement('input', { id: 'domoAge', type: 'text', name: 'age', placeholder: 'Domo Age' }),
        React.createElement(
            'label',
            { htmlFor: 'alignment' },
            'Alignment: '
        ),
        React.createElement(
            'select',
            { id: 'domoAlignment' },
            React.createElement(
                'option',
                { value: 'chaotic' },
                'Chaotic'
            ),
            React.createElement(
                'option',
                { value: 'lawful' },
                'Lawful'
            ),
            React.createElement(
                'option',
                { value: 'evil' },
                'Evil'
            ),
            React.createElement(
                'option',
                { value: 'good' },
                'Good'
            )
        ),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
    );
};

// determines what to draw
// iff array of domos is empty, show UI there are no domos yet
// update state of this component via ajax
// every time the state updates, page immediately creates UI and shows updates
var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            'div',
            { className: 'domoList' },
            React.createElement(
                'h3',
                { className: 'emptyDomo' },
                'No Domos Yet'
            )
        );
    }
    var domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            'div',
            { key: domo._id, className: 'domo' },
            React.createElement('imd', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
            React.createElement(
                'h3',
                { className: 'domoName' },
                'Name: ',
                domo.name,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'domoAge' },
                'Age: ',
                domo.age,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'domoAlignment' },
                'Alignment: ',
                domo.alignment,
                ' '
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'domoList' },
        domoNodes
    );
};

// grabs domos from the server and renders DomoList
// update the screen with changes wihtout switching pages
var loadDomosFromServer = function loadDomosFromServer() {
    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
    });
};

// takes CSRF token
// renders out to DOmoForm to the page and renders default DOmoList
var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

    loadDomosFromServer();
};

//gets CSRF token and loads the react components
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
'use strict';

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#domoMessage').animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $('#domoMessage').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
