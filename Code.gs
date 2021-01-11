function doGet() {
  // 取引所のAPIを取得してJSONをパースする
  var cc_response = UrlFetchApp.fetch("https://coincheck.com/api/ticker");
  var cc_json = JSON.parse(cc_response.getContentText());
  var bf_response = UrlFetchApp.fetch("https://api.bitflyer.jp/v1/ticker");
  var bf_json = JSON.parse(bf_response.getContentText());
  var zf_response = UrlFetchApp.fetch("https://api.zaif.jp/api/1/ticker/btc_jpy");
  var zf_json = JSON.parse(zf_response.getContentText());
  var bt_response = UrlFetchApp.fetch("https://www.btcbox.co.jp/api/v1/ticker/");
  var bt_json = JSON.parse(bt_response.getContentText());
  var qn_response = UrlFetchApp.fetch("https://api.quoine.com/products/5");
  var qn_json = JSON.parse(qn_response.getContentText());
  var bi_response = UrlFetchApp.fetch("https://public.bitbank.cc/btc_jpy/ticker");
  var bi_json = JSON.parse(bi_response.getContentText());
 
  // 取引所のオブジェクトを作る
  const exchanges = [
    { name: 'Coincheck', bid: cc_json["bid"], ask: cc_json["ask"] },
    { name: 'bitFlyer', bid: bf_json["best_bid"], ask: bf_json["best_ask"] },
    { name: 'Zaif', bid: zf_json["bid"], ask: zf_json["ask"] },
    { name: 'BtcBox', bid: bt_json["buy"], ask: bt_json["sell"] },
    { name: 'Quoinex', bid: qn_json["market_bid"], ask: qn_json["market_ask"] },
    { name: 'bitbank', bid: bi_json["data"]["buy"], ask: bi_json["data"]["sell"] }
  ];
   
  var html = HtmlService.createTemplateFromFile('index.html');
 
  html.date = new Date();
   
  html.exnames = '<span class="thcol">取引所</span>';
  html.bids = '<span class="thcol">売却</span>';    
  html.asks = '<span class="thcol">購入</span>';
  html.spreads = '<span class="thcol">Spread</span>';
 
  exchanges.forEach( function( value ) {
    html.exnames += '<span class="thcol">' + value.name + '</span>';
    html.bids += '<span class="tdcol" id="bid_' + value.name + '">' + Math.floor(value.bid) + '円</span>';    
    html.asks += '<span class="tdcol" id="ask_' + value.name + '">' + Math.floor(value.ask) + '円</span>';
    html.spreads += '<span class="tdcol">' + Math.floor(value.ask - value.bid) + '円</span>'; 
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
 
  html.top_ask = topAsk.name + "(" + Math.floor(topAsk.ask) + "円)";
  html.top_bid = topBid.name + "(" + Math.floor(topBid.bid) + "円)";
  html.difference = Math.floor(topBid.bid - topAsk.ask) + "円";
  html.bid_id = "bid_"+topBid.name;
  html.ask_id = "ask_"+topAsk.name;
   
  return html.evaluate();
}
