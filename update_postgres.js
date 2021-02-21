'use strict';

console.log('loading function');
var pgOpt = require('pg');
var AWS = require('aws-sdk');

//AWS.config.region = 'cn-north-1';


exports.handler = function(event,context,callback)
{
    
    var acctname=event.account;
    var branch=event.branch;
    var balance=event.balance;
    var cnt;
    var f=false;
   
    var sql="update "+branch+" set balance="+balance+" where acctname='"+acctname+"'";
    var str="select balance from "+branch+" where acctname='"+acctname+"'";
  //  var ss="select balance from "+branch+" where acctname='"+acctname+"'";
    var insertStr="insert into "+branch+" (acctname,balance) values('"+acctname+"',"+balance+")";
  
	    var pgConfig = {
        user: 'postgres',
        database: 'postgres',
        password: '6q2iOGzHoTQ1xAbsERfI',
        host: 'mpcdb.c1xekgwhzukm.us-east-1.rds.amazonaws.com',
        port: '5432',
        poolSize: 5,
        poolIdleTimeout: 30000,
        reapIntervalMillis: 10000
    };
    var pgPool = new pgOpt.Pool(pgConfig);
        pgPool.connect(function (isErr, client, done) {
        if (isErr) {
            console.log('connect query:' + isErr.message);
            return;
        }
        else
        {
            try 
            {
                 client.query(str, [], function (isErr, rst) 
                 {
                    done();
                    if (isErr) 
                    {
                        console.log('query error:' + isErr.message);
                    } 
                    else 
                    {
                        console.log('query success, data is: ' + JSON.stringify(rst.rows[0]));
                        //out=JSON.stringify(rst.rows[0]);
                        cnt=rst.rowCount;
                        f=true;
                    
                        judge(cnt,pgPool);
                    }
                });
            } 
            catch (e) {}
  
        }
       
    });
    function judge(cnt,pgPool){
    var sql="update "+branch+" set balance="+balance+" where acctname='"+acctname+"'";
    var str="select balance from "+branch+" where acctname='"+acctname+"'";
  //  var ss="select balance from "+branch+" where acctname='"+acctname+"'";
    var insertStr="insert into "+branch+" (acctname,balance) values('"+acctname+"',"+balance+")";
    if(cnt==0)
    {
       pgPool.connect(function (isErr, client, done) {
        if (isErr) {
            console.log('connect query:' + isErr.message);
            return;
        }
        try 
        {
            client.query(insertStr, [], function (isErr, rst) 
            {
                done();
                if (isErr) 
                {  
                    console.log('query error:' + isErr.message);
                } 
                else 
                {
                    callback(null,"Insert Success");
                }
            });
        } 
        catch (e) {}
       
    }); 
    }
    else
    {
        pgPool.connect(function (isErr, client, done) {
        if (isErr) {
            console.log('connect query:' + isErr.message);
            return;
        }
        try 
        {
            client.query(sql, [], function (isErr, rst) 
            {
                done();
                if (isErr) 
                {  
                    console.log('query error:' + isErr.message);
                } 
                else 
                {
                    callback(null,"Update Success");
                }
            });
        } 
        catch (e) {}
       
    }); 
    }
    }
    
    
    
    
    
    
    
        
};