var AWS = require('aws-sdk');
var s3 = new AWS.S3({signatureVersion:'v4',region:'us-east-1'});
var a;

exports.handler = function(event, context, callback) {

    var params = {
    	Bucket: "test-x-x", 
    	Key: "Account.txt"
    	
    };
    
   s3.getObject(params,function(err,data){
        if(err)
        {
            console.log("put object error");
            callback(err,null);
        }
        else
        {
            a=data.Body.toString().split("\r\n");
            for(var i in a)
            {
                 var b=a[i];
                 var account={
                  "name":b
                 };
                 a[i]=account;
             }
            console.log(a);
             callback(null,a);
             return a;
        }
    });
};