export interface TelegramService {
  sendOrderNotification(order: any): Promise<void>;
}

export class TelegramBotService implements TelegramService {
  private botToken: string;
  private chatId: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || "";
    this.chatId = process.env.TELEGRAM_CHAT_ID || "@Dark090111";
  }

  async sendOrderNotification(order: any): Promise<void> {
    if (!this.botToken) {
      console.warn("Telegram bot token not configured, skipping notification");
      return;
    }

    const message = this.formatOrderMessage(order);
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: "HTML",
        }),
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to send Telegram notification:", error);
      throw error;
    }
  }

  private formatOrderMessage(order: any): string {
    const items = order.items
      .map((item: any) => `• ${item.product.name} x${item.quantity} - ₪${item.price}`)
      .join('\n');

    return `
🛍️ <b>New Order #${order.id.slice(0, 8)}</b>

👤 <b>Customer:</b> ${order.customerName}
📱 <b>Phone:</b> ${order.customerPhone}
🏙️ <b>City:</b> ${order.customerCity}
🏠 <b>Address:</b> ${order.customerAddress}

📦 <b>Items:</b>
${items}

💰 <b>Total:</b> ₪${order.totalAmount}
📋 <b>Status:</b> ${order.status}

${order.notes ? `📝 <b>Notes:</b> ${order.notes}` : ''}

⏰ <b>Order Time:</b> ${new Date(order.createdAt).toLocaleString()}
    `.trim();
  }
}

export const telegramService = new TelegramBotService();
