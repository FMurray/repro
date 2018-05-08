var jsforce = require('jsforce');



let action = (username, password, isSandbox) => {
  let conn = new jsforce.Connection({
    loginUrl : (isSandbox) ? 'https://test.salesforce.com' : 'https://login.salesforce.com'
  });
  conn.login(username, password, function(err, userInfo){
    if(!err && userInfo){
      console.log('Logged in to organization ' + userInfo.organizationId);

      conn.request({
        method : 'get',
        url : '/services/data/v39.0/sobjects'
      }).then(function(data){
        let promiseArray = [];
        for(let v of data.sobjects){
          if(promiseArray.length < 5){
            console.log(v);
            promiseArray.push(conn.sobject(v.name).describe());
            break;
          }
        }
        
        Promise.all(promiseArray).then(function(data){
          console.log(data[0]);
        }, function(err){
          console.log(err);
        })
      })

    }else {
      console.log(err);
    }
  })
}

let doPrompt = () =>{
  var prompt = require('prompt');

  //
  // Start the prompt
  //
  prompt.start();

  //
  // Get two properties from the user: username and email
  //
  console.log("Enter your salesforce admin username and password (including security token)");
  prompt.get({properties: {
        username : {required : true},
        password: {
          hidden: true
        },
        sandbox : {
          type : 'string',
          description : 'Is this a sandbox environment? (Y/n)'
        }
      }}, function (err, result) {

      action(result.username, result.password, (sandbox == 'Y' || sandbox == 'y') ? true : false);

  });
}

let username = 'christopher.moyle@sixvertical.com';
let password = 'Seketha2%eWsVPFUW5ajWEs8jly90lwvY';
action(username, password, true);
