export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${env.SECRET_KEY}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    try {
      const data = await request.json();
      let messageText = '';

      // 定义Markdown转义函数
      function escapeMarkdown(text) {
        return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
      }

      // 处理位置信息（如果存在）
      if (data.location) {
        messageText += `📍 位置: ${escapeMarkdown(data.location)}\n\n`;
      }

      // 处理IPv4信息，仅在数据有效时添加
      if (data.ipv4 && data.ipv4.addr) {
        messageText += `🌐 IPv4: \`${escapeMarkdown(data.ipv4.addr)}\`\n`;
        if (data.ipv4.domains) {
          messageText += `🌍 域名: \`${escapeMarkdown(data.ipv4.domains)}\`\n`;
        }
        messageText += '\n';
      }

      // 处理IPv6信息，仅在数据有效时添加
      if (data.ipv6 && data.ipv6.addr) {
        messageText += `🌐 IPv6: \`${escapeMarkdown(data.ipv6.addr)}\`\n`;
        if (data.ipv6.domains) {
          messageText += `🌍 域名: \`${escapeMarkdown(data.ipv6.domains)}\`\n`;
        }
        messageText += '\n';
      }

      // 添加发送时间（新加坡时区）
      const now = new Date();
      const singaporeOffset = 8 * 60 * 60 * 1000; // 8小时的毫秒数
      const singaporeTime = new Date(now.getTime() + singaporeOffset);
      const month = (singaporeTime.getMonth() + 1).toString().padStart(2, '0');
      const day = singaporeTime.getDate().toString().padStart(2, '0');
      const hours = singaporeTime.getHours().toString().padStart(2, '0');
      const minutes = singaporeTime.getMinutes().toString().padStart(2, '0');
      const timeString = `${month}-${day} ${hours}:${minutes}`;
      messageText = `🕒 时间: ${escapeMarkdown(timeString)}\n` + messageText;

      // 发送消息到Telegram
      const telegramUrl = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.CHAT_ID,
          text: messageText,
          parse_mode: 'MarkdownV2'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return new Response(`Telegram API error: ${error.description}`, { status: response.status });
      }
      return new Response('Message sent successfully', { status: 200 });
    } catch (error) {
      return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
    }
  },
};
