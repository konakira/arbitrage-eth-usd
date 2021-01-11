function doGet() {
  // 取引所のAPIを取得してJSONをパースする
  var bittrex_response = UrlFetchApp.fetch("https://api.bittrex.com/v3/markets/ETH-USD/ticker");
  var bittrex_json = JSON.parse(bittrex_response.getContentText());
  var binance_response = UrlFetchApp.fetch("https://api.binance.com/api/v3/ticker/bookTicker?symbol=ETHUSDT");
  var binance_json = JSON.parse(binance_response.getContentText());
  var bitfinex_response = UrlFetchApp.fetch("https://api.bitfinex.com/v1/pubticker/ethusd");
  var bitfinex_json = JSON.parse(bitfinex_response.getContentText());
  
  // 取引所のオブジェクトを作る
  const exchanges = [
    { name: 'Bittrex', bid: bittrex_json["bidRate"], ask: bittrex_json["askRate"] },
    { name: 'Binance', bid: binance_json["bidPrice"], ask: binance_json["askPrice"] },
    { name: 'Bitfinex', bid: bitfinex_json["bid"], ask: bitfinex_json["ask"] },
  ];
   
  var html = HtmlService.createTemplateFromFile('index.html');
 
  html.date = new Date();
   
  html.exnames = '<span class="thcol">Exchange</span>';
  html.bids = '<span class="thcol">Bit</span>';    
  html.asks = '<span class="thcol">Ask</span>';
  html.spreads = '<span class="thcol">Spread</span>';
 
  exchanges.forEach( function( value ) {
    html.exnames += '<span class="thcol">' + value.name + '</span>';
    html.bids += '<span class="tdcol" id="bid_' + value.name + '">$' + Math.floor(value.bid) + '</span>';    
    html.asks += '<span class="tdcol" id="ask_' + value.name + '">$' + Math.floor(value.ask) + '</span>';
    html.spreads += '<span class="tdcol">$' + Math.floor(value.ask - value.bid) + '</span>'; 
  });
   
  // 一番高く売れる取引所を探す
  exchanges.sort(function(value1, value2) {
    return value2.bid - value1.bid;
  });
  var topBid = exchanges[0];
   
  // 一番安く買える取引所を探す
  exchanges.sort(function(value1, value2) {
    return value1.ask- value2.ask;
  });
  var topAsk = exchanges[0];
 
  html.top_ask = topAsk.name + "($" + Math.floor(topAsk.ask) + ")";
  html.top_bid = topBid.name + "($" + Math.floor(topBid.bid) + ")";
  html.difference = "$" + Math.floor(topBid.bid - topAsk.ask);
  html.bid_id = "bid_"+topBid.name;
  html.ask_id = "ask_"+topAsk.name;
   
  return html.evaluate();
}
