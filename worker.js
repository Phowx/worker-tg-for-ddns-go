export default {
  async fetch(request, env) {
    // 验证请求方法
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // 验证Authorization头
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${env.SECRET_KEY}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    try {
      // 解析请求体
      const data = await request.json();
      
      // 构建消息内容
      let messageText = '';
      if (data.message) {
        messageText = data.message;
      } else if (data.text) {
        messageText = data.text;
      } else if (typeof data === 'string') {
        messageText = data;
      } else if (data.ipv4 || data.ipv6) {
        // 格式化IPv4/IPv6信息
        messageText = '📶 DDNS信息更新 📶\n';
        if (data.location) {
          messageText += `📍 位置: ${data.location}\n\n`;
        } else {
          messageText += '\n';
        }
        if (data.ipv4) {
          messageText += '🌐 IPv4:\n' +
            `✅ 结果: ${data.ipv4.result}\n` +
            `📡 地址: ${data.ipv4.addr}\n` +
            `🌍 域名: ${data.ipv4.domains}\n\n`;
        }
        if (data.ipv6) {
          messageText += '🌐 IPv6:\n' +
            `✅ 结果: ${data.ipv6.result}\n` +
            `📡 地址: ${data.ipv6.addr}\n` +
            `🌍 域名: ${data.ipv6.domains}\n`;
        }
      } else {
        messageText = JSON.stringify(data, null, 2);
      }

      // 发送消息到Telegram
      const telegramUrl = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: env.CHAT_ID,
          text: messageText,
        }),
      });

      // 处理Telegram API响应
      if (!response.ok) {
        const error = await response.json();
        return new Response(`Telegram API error: ${error.description}`, {
          status: response.status,
        });
      }

      return new Response('Message sent successfully', { status: 200 });
    } catch (error) {
      return new Response(`Internal Server Error: ${error.message}`, {
        status: 500,
      });
    }
  },
};
