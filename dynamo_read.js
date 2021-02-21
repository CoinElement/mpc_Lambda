'use strict';
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var docClient = new AWS.DynamoDB.DocumentClient();

console.log('Loading event...');

exports.handler = function(event, context, callback) {

    var accountName;
    if(event.account) {
      accountName = event.account;
    } else if(event.queryStringParameters.account) {
      accountName = event.queryStringParameters.account;
    }
    var params = {
      TableName: 'branches',
      KeyConditionExpression:"#account=:account",
      ExpressionAttributeNames:{
        "#account":"account"
      },
      ExpressionAttributeValues:{
        ":account":accountName
      },
      Limit: 100
    };
    docClient.query(params, function(err, data){
      if(err){
        console.log('Failed to read from dynamodb');
        callback(err, null);
      }else{
        console.log('Successfully read from dynamodb');
       
        callback(null, data);
      }
    })
};