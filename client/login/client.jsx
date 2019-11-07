const handleLogin = (e) => {
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

const handleSignup = (e) => {
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
const LoginWindow = (props) => {
    return (
        <form id="loginForm" name="loginForm"
            onSubmit={handleLogin} action="/login"
            method="POST" className="mainForm">
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign in" />
        </form>
    );
};

const SignupWindow = (props) => {
    return (
        <form id="signupForm" name="signupForm"
            onSubmit={handleSignup} action="/signup"
            method="POST" className="mainForm">
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign up" />
        </form>
    );
};

// makes login window
// accepts Cross Site Request Forgery (CSRF) token to add to login form
// calling reactDOM.render allows rendering out our template to certain section of page
// loginWindow template rendered as HTML into the #content section
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// makes signup UI element
// renders new signup window that can handle react events
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// attach events to page buttons
// when user clicks signup or login pages, UI will re-render correct HTML without changing page
// defaults to login page
const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf); // default view
}

// makes request to get new CSRF tokens from server
// when we successfully get a token, we will set up rest of page
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// when page loads, make call to token
// then setup rest of page to allow React componenets to show pages without leaving the page
$(document).ready(function() {
    getToken();
});