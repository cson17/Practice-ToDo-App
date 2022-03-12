document.addEventListener('DOMContentLoaded', () => {
  const toDoContainer = document.getElementById('toDoContainer');
  let addBtn;
  function fetchToDos() {
      //add edit and delete buttons here?
    fetch('/api')
      .then((data) => data.json())
      .then((data) => data.forEach((toDo) => {
        const toDoBox = document.createElement('div');
        toDoBox.innerText = toDo.content;
        toDoContainer.appendChild(toDoBox);
      }))
      .catch((err) => {
        console.log(err);
      });
  };

  function updateToDo(content, id) {
    let method = 'PATCH';
    fetch('/api', {
      method,
      body: JSON.stringify({ content , id }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      //now we update the DOM with this new data
      .then((updatedToDo) => {
        const { content, _id } = updatedToDo;
        console.log(content);
        console.log(_id);
        //const toDoUpdate = document.getElementById(_id);
        // const querySelectorString = `#${_id} > p:first-of-type`;
        // const toDoUpdate = document.querySelector(querySelectorString);
        const toDoPTag = document.getElementById(_id).getElementsByTagName('p')[0];
        console.log(toDoPTag);

        // toDoUpdate
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function createToDo() {
    const inputBox = document.getElementById('inputBox');
    const method = 'POST';
    fetch('/api', {
      method,
      body: JSON.stringify({ content: inputBox.value }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((data) => data.json())
      .then((toDo) => {
        const newToDo = document.createElement('div');
        const text = document.createElement('p');
        text.innerText = toDo.content;
        newToDo.appendChild(text);
        newToDo.id = toDo._id;
        const updateBtn = document.createElement('button');
        updateBtn.textContent = 'edit';
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'delete';
        
        // when edit button is clicked
        // would be nice to have update button disappear after it's clicked
        updateBtn.addEventListener('click', () => {
          //edit btn clicked -> p becomes input, edit btn becomes save btn (remove from DOM)
          const input = document.createElement('input');
          input.value = text.innerText;
          text.replaceWith(input);
          const saveBtn = document.createElement('button');
          newToDo.appendChild(saveBtn);
          saveBtn.textContent = 'save';
          saveBtn.addEventListener('click', () => {updateToDo(input.value, toDo._id)})
        });
        
        deleteBtn.addEventListener('click', () => {
          deleteToDo(toDo._id);
        });
        newToDo.appendChild(updateBtn);
        newToDo.appendChild(deleteBtn);
        toDoContainer.appendChild(newToDo);
      })
      .catch((err) => {
        console.log(err);
      });
  };
 

  function saveUser() {
    const userName = document.getElementById('userSignUp');
    const password = document.getElementById('passSignUp');
    const method = 'POST';
    fetch('/api/user', {
      method,
      body: JSON.stringify({ username: userName.value, password: password.value }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((data) => data.json())
      .then((userID) => {
        const welcome = document.createElement('h1');
        welcome.innerText = `Hello valued user ${userID}`;
        const welcomeContainer = document.getElementById("welcomeContainer");
        welcomeContainer.appendChild(welcome);
        // userName.value = '';
        // password.value = ''; 
        document.getElementById('authentication').remove();
        const inputBox = document.createElement('input');
        inputBox.id = 'inputBox';
        const toDoInput = document.getElementById('toDoInput');
        addBtn = document.createElement('button');
        addBtn.id = 'addBtn';
        toDoInput.appendChild(inputBox);
        toDoInput.appendChild(addBtn);
        // addBtn = document.getElementById('addBtn');
        addBtn.textContent = 'add toDo';
        addBtn.addEventListener('click', createToDo);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const signUpBtn = document.getElementById('signUpBtn');
  signUpBtn.addEventListener('click', saveUser);

  
  function verifyUser(){
    const userName = document.getElementById('userSignIn');
    const password = document.getElementById('passSignIn');
    
    // POST method is prefered since username and password are sensitive and we
    // would rather they get saved in req.body (req.params can get saved in plain text
    // by browser for example in your browser history)... Also idempotence
    const method = 'POST';
    fetch('api/verifyUser', {
      method,
      body: JSON.stringify({ username: userName.value, password: password.value }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((data) => data.json())
      .then((userID) => {
        const welcome = document.createElement('h1');
        welcome.innerText = `So glad to see you again user ${userID}`;
        const welcomeContainer = document.getElementById("welcomeContainer");
        welcomeContainer.appendChild(welcome);
        // userName.value = '';
        // password.value = '';
        document.getElementById('authentication').remove();
        fetchToDos();
        const inputBox = document.createElement('input');
        inputBox.id = 'inputBox';
        const toDoInput = document.getElementById('toDoInput');
        addBtn = document.createElement('button');
        addBtn.id = 'addBtn';
        addBtn.textContent = 'add toDo';
        toDoInput.appendChild(inputBox);
        toDoInput.appendChild(addBtn);
        addBtn.addEventListener('click', createToDo);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const logInBtn = document.getElementById('logInBtn');
  logInBtn.addEventListener('click', verifyUser);  
});