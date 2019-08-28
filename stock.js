const request = require('request');

const getStockInfo = (stock, done) => {
	request.get('https://financialmodelingprep.com/api/v3/company/profile/' + stock, { json: true }, (err, res, body) => {
		if (err) {
			done(err);
		} else {
			done(null, body);
		}
	});
}

exports.getStockInfo = getStockInfo;