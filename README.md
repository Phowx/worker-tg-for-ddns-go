需要设置几个环境变量:`BOT_TOKEN` ,`CHAT_ID` ,`SECRET_KEY`
  
RequestBody加了location用于区分  

```
{
    "location": "某地",
    "ipv4": {
        "result": "#{ipv4Result}",
        "addr": "#{ipv4Addr}",
        "domains": "#{ipv4Domains}"
    },
    "ipv6": {
        "result": "#{ipv6Result}",
        "addr": "#{ipv6Addr}",
        "domains": "#{ipv6Domains}"
    }
}
