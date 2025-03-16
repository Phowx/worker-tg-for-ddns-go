**需要设置几个环境变量:**
BOT_TOKEN: 找`@BotFather`获取
CHAT_ID: 找`@getuseridbot`获取
SECRET_KEY: 用于Authorization: Bearer,随便设置一个

为RequestBody加了一个location用于区分不同的推送

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
