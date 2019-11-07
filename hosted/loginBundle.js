'use strict';

var handleLogin = function handleLogin(e) {
    e.preventDefault();

    $('#domoMessage').animate({ width: 'hide' }, 350);

    if ($('#user').val() == '' || $('#pass').val() == '') {
        console.log('one value is empty');
        handleError('RAWR! Username or password is empty');
        return false;
    }

    console.log($('input[name=_csrf]').val());

    sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);

    return false;
};

var handleSignup = function handleSignup(e) {
    console.log("handle signup");
    e.preventDefault();

    $('#domoMessage').animate({ width: 'hide' }, 350);

    if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
        handleError('RAWR! All fields are required');
        return false;
    }

    if ($('#pass').val() !== $('#pass2').val()) {
        handleError('RAWR! Passwords do not match');
        return false;
    }

    sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);

    return false;
};

// React Functional Stateless Components (FSCs)
// JSX is custom syntax, allows creation of HTML-like objects in JS as valid syntax
// allows to quickly create and render UI with higher speed and optimization
// secured against unsafe input
var LoginWindow = function LoginWindow(props) {
    return React.createElement(
        'form',
        { id: 'loginForm', name: 'loginForm',
            onSubmit: handleLogin, action: '/login',
            method: 'POST', className: 'mainForm' },
        React.createElement(
            'label',
            { htmlFor: 'username' },
            'Username: '
        ),
        React.createElement('input', { id: 'user', type: 'text', name: 'username', placeholder: 'username' }),
        React.createElement(
            'label',
            { htmlFor: 'pass' },
            'Password: '
        ),
        React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'password' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Sign in' })
    );
};

var SignupWindow = function SignupWindow(props) {
    return React.createElement(
        'form',
        { id: 'signupForm', name: 'signupForm',
            onSubmit: handleSignup, action: '/signup',
            method: 'POST', className: 'mainForm' },
        React.createElement(
            'label',
            { htmlFor: 'username' },
            'Username: '
        ),
        React.createElement('input', { id: 'user', type: 'text', name: 'username', placeholder: 'username' }),
        React.createElement(
            'label',
            { htmlFor: 'pass' },
            'Password: '
        ),
        React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'password' }),
        React.createElement(
            'label',
            { htmlFor: 'pass2' },
            'Password: '
        ),
        React.createElement('input', { id: 'pass2', type: 'password', name: 'pass2', placeholder: 'retype password' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Sign up' })
    );
};

// makes login window
// accepts Cross Site Request Forgery (CSRF) token to add to login form
// calling reactDOM.render allows rendering out our template to certain section of page
// loginWindow template rendered as HTML into the #content section
var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

// makes signup UI element
// renders new signup window that can handle react events
var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

// attach events to page buttons
// when user clicks signup or login pages, UI will re-render correct HTML without changing page
// defaults to login page
var setup = function setup(csrf) {
    var loginButton = document.querySelector("#loginButton");
    var signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", function (e) {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", function (e) {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf); // default view
};

// makes request to get new CSRF tokens from server
// when we successfully get a token, we will set up rest of page
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

// when page loads, make call to token
// then setup rest of page to allow React componenets to show pages without leaving the page
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
