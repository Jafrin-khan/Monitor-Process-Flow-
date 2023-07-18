let PTN="JAFKHA009" +  Math.floor(Math.random() * 1000);

let headers = {
    'Authorization': ``,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'x-qos': '0',
  };

module.exports = {
    PTN , headers
}
