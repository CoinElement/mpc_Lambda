'use strict';
console.log('loading function');

var AWS = require('aws-sdk');
//AWS.config.region = 'ap-northeast-2';

var docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = function(event,context,callback)
{
	var total;
	console.log("Account:", event.account);

	var request = require('request');
	console.log("req");
	request('http://mpc.blockvive.com:2020/GetAcctBal?AcctName='+event.account, function (error, response, body) {
	    console.log(response.statusCode);
  if (!error && response.statusCode == 200) {
      var body=JSON.parse(response.body);
            console.log(body);
    total=body.GrandTotal;
    console.log(total);
    write(event.account,total);
  }
});
	function write(account,total){
	    	var sd = require('silly-datetime');
    var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	    var params = {
		Item:{
			account:event.account,
			time_stamp:time,
            total:total,
            branches:event.branches
	    },
		TableName:"results"
	};
	docClient.put(params,function(err,data)
	{
		if(err)
		{
			console.log('Fail to write');
			callback(err,null);
		}
		else
		{
			console.log('Success to write');
			callback(null,data);
		}
	});
	}
};