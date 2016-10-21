#!/usr/bin/env node

require('dotenv').config();
var
	async   = require('async'),
	chalk   = require('chalk'),
	fs      = require('fs'),
	Route53 = require('nice-route53')
	;

var r53 = new Route53({
	accessKeyId     : process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
});

if (process.argv.length < 4)
{
	console.error('Usage: route66 example.com input-file');
	process.exit(1);
}

var zone = process.argv[2];
var inputf = process.argv[3];
var zoneID;

var lines = fs.readFileSync(inputf, 'utf8').trim().split('\n');
console.log(chalk.green(`Read ${lines.length} records to add...`));

function createCNAME(item, callback)
{
	var pieces = item.split(' ');
	var fqdn = pieces[0];
	var cname = pieces[1];

	var args = {
	    zoneId : zoneID,
	    name   : fqdn,
	    type   : 'CNAME',
	    ttl    : 600,
	    values : [ cname, ],
	};
	r53.setRecord(args, function(err, res)
	{
	    console.log(res);
		callback(err);
	});
}

r53.zoneInfo(zone, function(err, info)
{
	if (err) throw err;

	zoneID = info.zoneId;

	async.eachSeries(lines, createCNAME, function(err, results)
	{
		if (err) throw err;
	});
});
