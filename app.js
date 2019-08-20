/*this section is adding the npm libraries to nodejs */

const Express = require("express");
const Mongoose = require('mongoose');

var request = require('request');
var bodyParser = require('body-parser');

//Now creating a object for class Express called app

var app = new Express();

//Adding a middleware.EJS template engine

app.set('view engine','ejs'); 

//For parsing a req.body we need body-parser. below code is that

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Connect to a mongodb called employeedb

Mongoose.connect("mongodb://localhost:27017/employeedb");

//Creating a schema using collection name employeedetail

const EmployeeModel= Mongoose.model("employeedetail",{
    ename:String,
    edesign:String,
    esalary:String
});

//creating a route named index for  Our Homepage

app.get('/',(req,res)=>{
    res.render('index');
})

//creating a route named addemployee

app.get('/addemployee',(req,res)=>{
    res.render('addemployee');
}); 

//this is a API(Name of API is '/read') for inserting data towards the database employeedb

app.post('/read',(req,res)=>{
    //var items=req.body;
    //res.render('read',{item:items});

    var employee = new EmployeeModel(req.body);
    var result = employee.save((error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send("<script>alert('Employee Successfully Inserted')</script>");
        }
    });

});

//this is an API to retrieve values from the database employeedb

app.get('/employeeall',(req,res)=>{

    var result = EmployeeModel.find((error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });
});

/* 
    STEPS FOR BELOW CODE
    1) --> Below code says that a route '/viewemployee' is created. 
    2) --> Then a request is gone to APIurl.
    3) --> Now the APIurl(Name of API is '/employeeall') runs its own code. 
    4) --> Afterwards from the APIurl data is parsed to JSON.
    5) --> Now this parsed JSON data is displayed on to our webpage.
*/

const APIurl = "http://localhost:3456/employeeall";

app.get('/viewemployee',(req,res)=>{

    request(APIurl,(error,response,body)=>{
        var data = JSON.parse(body);
        res.render('viewemployee',{data:data});
    });
});

//A route set for page searchemployee

app.get('/searchemployee',(req,res)=>{
    res.render('searchemployee');
});

// A route named '/employeename' to fetch a single employee detail

app.get('/employeename',(req,res)=>{
    var item = req.query.ename;
    //app.get('/emplyee/:id)
    //item=req.params.id;
    //var item = req.body.ename;
    //console.log(item);
    var result = EmployeeModel.find({ename:item},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    })

});

/* 
    STEPS FOR BELOW CODE
    1) --> Below code says that a route '/viewsingleemployee' is created. 
    2) --> Then a request is gone to APIurl.
    3) --> Now the APIurl(Name of API is '/employeename') runs its own code. 
    4) --> Afterwards from the APIurl data is parsed to JSON.
    5) --> Now this parsed JSON data is displayed on to our webpage.
*/

const APIurl2 = "http://localhost:3456/employeename";

app.post('/viewsingleemployee',(req,res)=>{

    var item = req.body.ename;

    request(APIurl2+"/?ename="+item,(error,response,body)=>{
        var data = JSON.parse(body);
        res.render('viewsingle',{data:data});
    })
});

//A route for page deleteemployee

app.get('/deleteemployee',(req,res)=>{
    res.render('deleteemployee');
});

//An API to delete employee

app.get('/deleteAPI',(req,res)=>{
    var item= req.query.ename;

    var result = EmployeeModel.deleteOne({ename:item},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    })
})

/* 
    STEPS FOR BELOW CODE
    1) --> Below code says that a route '/empdelete' is created. 
    2) --> Then a request is gone to APIurl.
    3) --> Now the APIurl(Name of API is '/deleteAPI') runs its own code. 
    4) --> Afterwards from the APIurl data is parsed to JSON.
    5) --> Now this parsed JSON data is displayed on to our webpage.
*/

const APIurl3 = "http://localhost:3456/deleteAPI"

app.post('/empdelete',(req,res)=>{
    var item = req.body.ename;

    request(APIurl3+"/?ename="+item,(error,response,body)=>{

        res.send("<script>alert('Employee Deleted')</script><script>window.location.href='/deleteemployee'</script>");

    })
});

// Setting the PORT or assigning a free PORT towards nodemon

app.listen(process.env.PORT || 3456,()=>{
    console.log("Server running on port::3456...");
});  //we can assign any number.3000 is commonly used.