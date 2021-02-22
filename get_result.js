'use strict';
console.log('loading function');
var pgOpt = require('pg');
var AWS = require('aws-sdk');

exports.handler = function(event,context,callback)
{
    var acctname=event.account;
    var out;
    //var str="select balance from "+branch+" where acctname='"+acctname+"'";
    var str='SELECT * FROM results_table WHERE acctname = '+"'"+acctname+"'"+' ORDER BY ("timestamp") DESC LIMIT 10';
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
                        out=rst.rows;
                        console.log(rst);
                        callback(null,out);
                    }
                });
            } 
            catch (e) {}
  
        }
       
    });
};