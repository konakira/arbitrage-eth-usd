function doGet() {
  // Portfolio
  const btcamount = 7;
  const ethamount = 2000;
  const dashamount = 35;
  
  // 取引所のAPIを取得してJSONをパースする
  var btc_response = UrlFetchApp.fetch("https://coincheck.com/api/rate/btc_jpy");
  var btc_json = JSON.parse(btc_response.getContentText());
  var eth_response = UrlFetchApp.fetch("https://coincheck.com/api/rate/eth_jpy");
  var eth_json = JSON.parse(eth_response.getContentText());
  var dash_response = UrlFetchApp.fetch("https://coincheck.com/api/rate/dash_jpy");
  var dash_json = JSON.parse(dash_response.getContentText());
    
  var html = HtmlService.createTemplateFromFile('index.html');
 
  html.date = new Date();
   
  html.btc = '<span class="thcol">Bitcoin</span>' + '<span class="thcol">' + btcamount.toLocaleString() + 'BTC</span>' + '<span class="thcol">' + Math.floor(btc_json["rate"]).toLocaleString() + 'Yen/BTC</span>' + '<span class="thcol">' + Math.floor(btcamount * btc_json["rate"]).toLocaleString() + 'Yen</span>';
  html.eth = '<span class="thcol">Ethereum</span>' + '<span class="thcol">' + ethamount.toLocaleString() + 'ETH</span>' + '<span class="thcol">' + Math.floor(eth_json["rate"]).toLocaleString() + 'Yen/ETH</span>' + '<span class="thcol">' + Math.floor(ethamount * eth_json["rate"]).toLocaleString() + 'Yen</span>';
  html.dash = '<span class="thcol">Dash</span>' + '<span class="thcol">' + dashamount.toLocaleString() + 'DASH</span>' + '<span class="thcol">' + Math.floor(dash_json["rate"]).toLocaleString() + 'Yen/DASH</span>' + '<span class="thcol">' + Math.floor(dashamount * dash_json["rate"]).toLocaleString() + 'Yen</span>';
  html.total = '<span class="thcol">Total</span><span class="thcol">-</span><span class="thcol">-</span><span class="thcol">' + Math.floor((btcamount * btc_json["rate"]) + (ethamount * eth_json["rate"]) + (dashamount * dash_json["rate"])).toLocaleString() + 'Yen</span>';
 
  return html.evaluate();
}
