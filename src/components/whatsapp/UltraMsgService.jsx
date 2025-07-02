
export class UltraMsgService {
  constructor(instanceId, token) {
    this.instanceId = instanceId;
    this.token = token;
    this.baseUrl = `https://api.ultramsg.com/${instanceId}`;
  }

  async sendMessage(to, body, type = 'text') {
    try {
      const response = await fetch(`${this.baseUrl}/messages/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          token: this.token,
          to: to,
          body: body,
          type: type
        })
      });

      const result = await response.json();
      console.log('UltraMsg response:', result);
      return result;
    } catch (error) {
      console.error('UltraMsg error:', error);
      throw error;
    }
  }

  async sendDocument(to, document, caption = '') {
    try {
      const formData = new FormData();
      formData.append('token', this.token);
      formData.append('to', to);
      formData.append('document', document);
      formData.append('caption', caption);

      const response = await fetch(`${this.baseUrl}/messages/document`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log('UltraMsg document response:', result);
      return result;
    } catch (error) {
      console.error('UltraMsg document error:', error);
      throw error;
    }
  }

  async getInstanceStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/instance/status?token=${this.token}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('UltraMsg status error:', error);
      throw error;
    }
  }
}

// Singleton instance
let ultraMsgInstance = null;

export const initUltraMsg = (instanceId, token) => {
  ultraMsgInstance = new UltraMsgService(instanceId, token);
  return ultraMsgInstance;
};

export const getUltraMsg = () => {
  if (!ultraMsgInstance) {
    throw new Error('UltraMsg not initialized. Call initUltraMsg first.');
  }
  return ultraMsgInstance;
};
