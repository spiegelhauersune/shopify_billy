const { MongoClient } = require('mongodb');

const matchStage = {
      $match : {"operationType" : "insert" }
};

var async = require('async'),
    request = require('request');

var accessToken = '89c063d25c138fa44ae36a7bb39bd55dd73671c8';

//Define a reusable function to send requests to the Billy's Billing API
var billyRequest = function(method, url, body, callback) {
	body = body || {}
	request({
		url: 'https://api.billysbilling.com/v2' + url,
		method: method,
		headers: {
			'X-Access-Token': accessToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}, function(err, res, body) {
		if (err) {
			callback(err);
		} else {
			callback(null, {
				status: res.statusCode,
				body: JSON.parse(body)
			});
		}
	});
};

var organizationId, contactId;

async.series([
	function(callback) {
		billyRequest('GET', '/organization', {}, function(err, res) {
			if (err) {
				callback(err);
			} else if (res.status !== 200) {
				console.log('Something went wrong:');
				console.log(res.body);
				process.exit();
			} else {
				organizationId = res.body.organization.id;
				callback();
			}
		});
	},
	function(callback) {
		MongoClient.connect( process.env.CONNECTIONSTRING, { useUnifiedTopology: true })
			.then(client => {
				console.log("connected to database");
				const db = client.db('proxy');
				const userCollection = db.collection('contacts');
				userCollection.watch([matchStage]).on('change', c => {
						var changeObj = JSON.parse(JSON.stringify(c));
						const map = new Map(Object.entries(changeObj.fullDocument));
						billyRequest('POST', '/contacts', {
							contact: {
								organizationId: organizationId,
								type: map.get('type')?map.get('type'):'person',
								name: map.get('name')?map.get('name'):'',
								countryId: map.get('countryId')?map.get('countryId'):'DK',
								street: map.get('street')?map.get('street'):'',
								cityText: map.get('cityText')?map.get('cityText'):'',
								stateText: map.get('stateText')?map.get('stateText'):'',
								zipcodeText: map.get('zipcodeText')?map.get('zipcodeText'):'',
								contactNo: map.get('contactNo')?map.get('contactNo'):'',
								phone: map.get('phone')?map.get('phone'):'',
								fax: map.get('fax')?map.get('fax'):'',
								isCustomer: map.get('isCustomer')?map.get('isCustomer'):false,
								isSupplier: map.get('isSupplier')?map.get('isSupplier'):false,
							}
						}, function(err, res) {
							if (err) {
								console.log(err);
							} else if (res.status !== 200) {
								console.log('Something went wrong:');
								console.log(res.body);
								process.exit();
							} else {
								console.log(res.body)
							}
						});
					});
			})
			.catch(console.error);
	}
], function(err) {
	if (err) {
		console.log(err);
	}
	process.exit();
});
