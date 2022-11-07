const express = require('express');
var fs = require('fs');
const app = express();
let bodyParser = require('body-parser');
const port = process.env.PORT || 9080;

let tempJson = {};
app.use(bodyParser.json());
app.listen(9080, () => {
  console.log(`Server is up on port ${port}`);
});

app.get('/*', (req, res) => {
  const url = req.url;

  if (url.includes('get')) {
    let users = getUsersFromJson();
    // console.log(users.length);
    // let users3 = JSON.stringify(users);
    // let users2 = JSON.parse(users3);
    // console.log(users.length);
    // console.log(users);
    res.send(users);
  } else {
    if (url == '/') {
      res.sendFile(__dirname + '/index.html');
    } else {
      res.sendFile(__dirname + url);
    }
  }
});

app.post('/postobject', (req, res) => {
  tempJson.fname = req.body.fname;
  tempJson.lname = req.body.lname;
  tempJson.age = req.body.age;
  tempJson.gender = req.body.gender;
  tempJson.dept = req.body.dept;
  tempJson.DOB = req.body.DOB;
  tempJson.UID = req.body.UID;

  let users = getUsersFromJson();
  users.push(tempJson);
  setUserstoJson(users);
});

app.put('/updateobject/:id', (req, res) => {
  let UID = req.params.id;
  let users = getUsersFromJson();
  let data = req.body;

  console.log(data);

  
});

app.delete('/deleteobject/:id', (req, res) => {
  let UID = req.params.id;
  console.log('Inside App.delete : ' + UID);
  let users = getUsersFromJson();
  // console.log(users);
  for (let i in users) {
    let data = users[i];
    if (data.UID.toString() === UID) {
      console.log(
        '--------------------------Data Matching -----------------------'
      );
      users.splice(i, 1);
    }
  }
  setUserstoJson(users);
  res.send('DOne');
});

function getUsersFromJson() {
  let dbJson;
  let users = [];

  try {
    // console.log('inside reading File getUsersFromJson : ');
    let jsonString = fs.readFileSync('./db.json', 'utf-8');
    dbJson = JSON.parse(jsonString);
    //console.log(dbJson);
    if (dbJson.length != 0) {
      for (let i in dbJson) {
        users.push(dbJson[i]);
      }
    }
  } catch (err) {
    console.log(err);
  }

  //console.log('getUsersFromJson:' + users);
  users = JSON.stringify(users);
  users = JSON.parse(users);
  console.log(users.length);
  // for (let i in users) {
  //   console.log(users[i]);
  // }
  // console.log(users);
  return users;
}

function setUserstoJson(users) {
  console.log('setting users to Json');
  console.log(users);
  fs.writeFileSync('db.json', JSON.stringify(users, null, 2), (err) => {
    if (err) {
      // console.log(err);
      return;
    }
  });
}
