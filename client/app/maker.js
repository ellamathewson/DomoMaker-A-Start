const handleDomo = (e) => {
    e.preventDefault();
  
    $('#domoMessage').animate({ width: 'hide' }, 350);
  
    if ($('#domoName').val() == '' || $('#domoAge').val() == '') {
      handleError('RAWR! All fields are required');
      return false;
    }
  
    sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), () => {
      loadDomosFromServer();
    });
    return false;
  };
  
  const DomoForm = (props) => {
      return (
          <form id="domoForm" onSubmit={handleDomo}
          name="domoForm" action="/maker"
          method="POST" className="domoForm">
              <label htmlFor="name">Name: </label>
              <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
              <label htmlFor="age">Age: </label>
              <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
              <label htmlFor="alignment">Alignment: </label>
              {/* <select id="domoAlignment">
                  <option value="Chaotic">Chaotic</option>
                  <option value="Lawful">Lawful</option>
                  <option value="Evil">Evil</option>
                  <option value="Good">Good</option>
              </select> */}
              <input id="domoAlignment" type="text" name="alignment" placeholder="Domo Alignment" />
              <input type="hidden" name="_csrf" value={props.csrf} />
              <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
          </form>
      );
  };

  
  
  // determines what to draw
  // iff array of domos is empty, show UI there are no domos yet
  // update state of this component via ajax
  // every time the state updates, page immediately creates UI and shows updates
  const DomoList = function(props) {
    // var e = document.getElementById("domoAlignment");
    // var selectedAlignment = e.options[e.selectedIndex].value;
      if(props.domos.length === 0) {
          return (
              <div className="domoList">
                  <h3 className="emptyDomo">No Domos Yet</h3>
              </div>
          );
      }
      const domoNodes = props.domos.map(function(domo) {
          console.log(props.domos);
          return (
              <div key={domo._id} className="domo">
                  <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                  <h3 className="domoName">Name: {domo.name} </h3>
                  <h3 className="domoAge">Age: {domo.age} </h3>
                  <h3 className="domoAlignment">Alignment: {domo.alignment} </h3>
              </div>
          );
      });
  
      return (
          <div className="domoList">
              {domoNodes}
          </div>
      );
  };
  
  // grabs domos from the server and renders DomoList
  // update the screen with changes wihtout switching pages
  const loadDomosFromServer = () => {
      sendAjax('GET', '/getDomos', null, (data) => {
          ReactDOM.render(
              <DomoList domos={data.domos} />, document.querySelector("#domos")
          );
      });
  };
  
  // takes CSRF token
  // renders out to DOmoForm to the page and renders default DOmoList
  const setup = function(csrf) {
      ReactDOM.render(
          <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
      );
  
      ReactDOM.render(
          <DomoList domos={[]} />, document.querySelector("#domos")
      );
  
      loadDomosFromServer();
  };
  
  //gets CSRF token and loads the react components
  const getToken = () => {
      sendAjax('GET', '/getToken', null, (result) => {
          setup(result.csrfToken);
      });
  };
  
  $(document).ready(function() {
      getToken();
  });
  