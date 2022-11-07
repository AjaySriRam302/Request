let users = [];

function deleteProfile(uid) {
  console.log(users.length);

  makeDeleteRequest(uid);
  makeGetRequest().then((res) => {
    users = res;
    renderProfilesInTable();
  });
}

function editProfile(UID) {
  let ID1 = document.getElementById('saveButton');
  let ID2 = document.getElementById('subButton');
  ID1.style.display = 'block';
  ID2.style.display = 'none';
  let data;
  for (let i in users) {
    if (UID === users[i].UID) {
      data = users[i];
    }
  }
  displayForm();

  reEnterInForm(data);
  //console.log(data);
  ID1.addEventListener('click', () => {
    makePutRequest(UID);
  });
}

function reEnterInForm(data) {
  let fname = document.getElementById('fname');
  let lname = document.getElementById('lname');
  let dept = document.getElementById('Dept');
  let DOB = document.getElementById('DOB');
  let gender = document.getElementsByName('Gender');

  fname.value = data.fname;
  lname.value = data.lname;
  DOB.value = data.DOB;
  dept.value = data.dept;
  for (let i = 0; i < gender.length; i++) {
    if (gender[i].value == data.gender) {
      gender[i].checked = true;
    }
  }
}

function updateProfile(uid) {}

function renderProfilesInTable() {
  let table = document.getElementById('profileTable');
  clearTable();

  for (let i = 0; i < users.length; i++) {
    let data = users[i];
    console.log(data.UID);
    let row = table.insertRow(i + 1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
    let cell7 = row.insertCell(6);
    let stringButton = `<button onclick= "editProfile(${data.UID})" id = "editButton">Edit</button><button onclick="deleteProfile(${data.UID})" id="deleteButton">Delete</button>`;
    cell1.innerHTML = i + 1;
    cell2.innerHTML = data.fname + ' ' + data.lname;
    cell3.innerHTML = data.DOB;
    cell4.innerHTML = data.age;
    cell5.innerHTML = data.gender;
    cell6.innerHTML = data.dept;
    cell7.innerHTML = stringButton;
  }
}

function clearTable() {
  let table = document.getElementById('profileTable');
  for (let rownumber = table.rows.length - 1; rownumber > 0; rownumber--) {
    table.deleteRow(rownumber);
  }
}

function submitForm() {
  console.log('inside submitForm');

  let fname = document.getElementById('fname').value;
  let lname = document.getElementById('lname').value;
  let dept = document.getElementById('Dept').value;
  let DOB = document.getElementById('DOB').value;
  let age = calculateAge(DOB);
  let ele = document.getElementsByName('Gender');
  let gender;

  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      gender = ele[i].value;
    }
  }
  let UID = new Date().getTime();

  let userData = {
    fname: fname,
    lname: lname,
    gender: gender,
    DOB: DOB,
    age: age,
    dept: dept,
    UID: UID
  };
  // console.log(userData);
  makePostRequest(userData);
  setTimeout(screenLoad(), 2000);
  renderProfilesInTable();
}

function calculateAge(DOB) {
  let dateOfBirth = new Date(DOB);
  let month_diff = Date.now() - dateOfBirth.getTime();
  let age_dt = new Date(month_diff);
  let year = age_dt.getUTCFullYear();
  let age = Math.abs(year - 1970);

  return age;
}

function makeGetRequest() {
  // console.log('insideGetRequest');

  let promise = new Promise((resolve, reject) => {
    console.log('Inside promise ');
    let request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:9080/get', true);
    request.responseType = 'json';

    request.onerror = () => {
      console.log('Network error occurred');
    };

    request.onload = () => {
      resolve(request.response);
    };
    request.send('response sent');
  });

  // console.log(promise);
  return promise;
}

function makePostRequest(userData) {
  const request = new XMLHttpRequest();
  // console.log('inside makePostRequest');
  request.open('POST', 'http://localhost:9080/postobject');

  request.setRequestHeader('Content-Type', 'application/json');

  request.send(JSON.stringify(userData));
}
function makePutRequest(UID) {
  const request = new XMLHttpRequest();
  // console.log('inside makePostRequest');

  console.log(UID);
  request.open('PUT', `http://localhost:9080/putobject/${UID}`);

  let fname = document.getElementById('fname').value;
  let lname = document.getElementById('lname').value;
  let dept = document.getElementById('Dept').value;
  let DOB = document.getElementById('DOB').value;
  let age = calculateAge(DOB);
  let ele = document.getElementsByName('Gender');
  let gender;

  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      gender = ele[i].value;
    }
  }

  let userData = {
    fname: fname,
    lname: lname,
    gender: gender,
    DOB: DOB,
    age: age,
    dept: dept,
    UID: UID
  };

  request.setRequestHeader('Content-Type', 'application/json');

  request.send(JSON.stringify(userData));
}
function makeDeleteRequest(UID) {
  console.log('Inside Delete Request');
  const request = new XMLHttpRequest();
  request.open('DELETE', `http://localhost:9080/deleteobject/${UID}`);
  console.log('UID :' + UID);
  request.onerror = () => {
    console.log('Network error occurred');
  };

  request.send();
}
function screenLoad() {
  pageRefresh();
  let promise = makeGetRequest();
  console.log(promise);
  promise.then((res) => {
    users = res;
    console.log(users);
    console.log('Screen has been loaded');
  });
}
function displayProfiles() {
  renderProfilesInTable();

  let ID1 = document.getElementById('profileTableDiv');
  let ID2 = document.getElementById('Profile');
  ID1.style.display = 'block';
  ID2.style.display = 'none';

  let ID3 = document.getElementById('saveButton');
  let ID4 = document.getElementById('subButton');
  ID3.style.display = 'block';
  ID4.style.display = 'none';
}

function pageRefresh() {
  document.getElementById('fname').value = '';
  document.getElementById('lname').value = '';
  document.getElementById('Dept').value = 'Select';
  document.getElementById('DOB').value = '';
}
function displayForm() {
  pageRefresh();
  let ID1 = document.getElementById('profileTableDiv');
  let ID2 = document.getElementById('Profile');
  ID1.style.display = 'none';
  ID2.style.display = 'block';
}
