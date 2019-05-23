'use strict';

const AWS = require('aws-sdk');
const util = require('util'); 

const sendMessageToClient = (url, connectionId, payload) => new Promise((resolve, reject) => {
  const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({apiVersion: '2029', endpoint: url});
  apigatewaymanagementapi.postToConnection({
    ConnectionId: connectionId, // connectionId of the receiving ws-client
    // Data: JSON.stringify(payload),
    Data: payload["body"],
  }, (err, data) => {
    if (err) {
      console.log('err is', err);
      reject(err);
    }
    resolve(data);
  });
});

module.exports.defaultHandler = async (event, context) => {
  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;
  const callbackUrlForAWS = util.format(util.format('https://%s/%s', domain, stage)); //construct the needed url
  console.log(callbackUrlForAWS);
  await sendMessageToClient(callbackUrlForAWS, connectionId, event);

  return {
    statusCode: 200
  };
}