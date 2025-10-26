
const Parser = require('rss-parser');
const parser = new Parser({headers:{'User-Agent':'CyberBook/1.0'}});
const SOURCES=[
  {name:'PortSwigger',url:'https://portswigger.net/daily-swig/rss'},
  {name:'OWASP',url:'https://owasp.org/news/index.xml'},
  {name:'NIST',url:'https://www.nist.gov/news-events/cybersecurity/rss.xml'},
  {name:'CISA',url:'https://www.cisa.gov/newsroom/all-news.xml'},
  {name:'BleepingComputer',url:'https://www.bleepingcomputer.com/feed/'},
  {name:'The Hacker News',url:'https://feeds.feedburner.com/TheHackersNews'}
];
module.exports=async function(context,req){
  try{
    const results=[];
    for(const s of SOURCES){
      try{
        const feed = await parser.parseURL(s.url);
        (feed.items||[]).forEach(it=> results.push({source:s.name,title:(it.title||'').toString().slice(0,240),link:(it.link||''),pubDate:it.isoDate||it.pubDate||new Date().toISOString()}));
      }catch(e){ context.log('err',s.name,e.message); }
    }
    results.sort((a,b)=> new Date(b.pubDate)-new Date(a.pubDate));
    context.res={ status:200, headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}, body: results };
  }catch(e){ context.res={status:500, body:{error:'Falha'}}; }
};
