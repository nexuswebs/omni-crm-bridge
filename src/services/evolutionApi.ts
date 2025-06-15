
interface EvolutionApiConfig {
  baseUrl: string;
  apiKey: string;
}

interface CreateInstanceRequest {
  instanceName: string;
  token?: string;
  qrcode?: boolean;
  webhook?: string;
  webhook_by_events?: boolean;
  webhook_base64?: boolean;
  events?: string[];
}

interface InstanceResponse {
  instance: {
    instanceName: string;
    status: string;
    serverUrl?: string;
    apikey?: string;
  };
  hash?: {
    apikey: string;
  };
  qrcode?: {
    pairingCode?: string;
    code?: string;
    base64?: string;
  };
}

interface QRCodeResponse {
  base64: string;
  code: string;
  pairingCode?: string;
}

interface ConnectionState {
  instance: {
    instanceName: string;
    state: string;
    status: string;
  };
  qrcode?: QRCodeResponse;
}

export class EvolutionApiService {
  private config: EvolutionApiConfig;

  constructor(config: EvolutionApiConfig) {
    this.config = config;
  }

  async createInstance(instanceName: string, webhook?: string): Promise<InstanceResponse> {
    const payload: CreateInstanceRequest = {
      instanceName,
      qrcode: true,
      webhook: webhook || 'https://seu-crm.com/webhook/whatsapp',
      webhook_by_events: true,
      webhook_base64: false,
      events: [
        'APPLICATION_STARTUP',
        'QRCODE_UPDATED',
        'MESSAGES_UPSERT',
        'MESSAGES_UPDATE',
        'MESSAGES_DELETE',
        'SEND_MESSAGE',
        'CONTACTS_SET',
        'CONTACTS_UPSERT',
        'CONTACTS_UPDATE',
        'PRESENCE_UPDATE',
        'CHATS_SET',
        'CHATS_UPSERT',
        'CHATS_UPDATE',
        'CHATS_DELETE',
        'GROUPS_UPSERT',
        'GROUP_UPDATE',
        'GROUP_PARTICIPANTS_UPDATE',
        'CONNECTION_UPDATE',
        'LABELS_EDIT',
        'LABELS_ASSOCIATION',
        'CALL_UPSERT'
      ]
    };

    console.log('Criando instância Evolution API:', { instanceName, url: this.config.baseUrl });

    const response = await fetch(`${this.config.baseUrl}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.config.apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao criar instância:', response.status, errorText);
      throw new Error(`Erro ao criar instância: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Instância criada com sucesso:', data);
    return data;
  }

  async connectInstance(instanceName: string): Promise<ConnectionState> {
    console.log('Conectando instância:', instanceName);

    const response = await fetch(`${this.config.baseUrl}/instance/connect/${instanceName}`, {
      method: 'GET',
      headers: {
        'apikey': this.config.apiKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao conectar instância:', response.status, errorText);
      throw new Error(`Erro ao conectar instância: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Resposta da conexão:', data);
    return data;
  }

  async getQRCode(instanceName: string): Promise<QRCodeResponse> {
    const response = await fetch(`${this.config.baseUrl}/instance/qrcode/${instanceName}`, {
      method: 'GET',
      headers: {
        'apikey': this.config.apiKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao buscar QR Code:', response.status, errorText);
      throw new Error(`Erro ao buscar QR Code: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  }

  async getInstanceStatus(instanceName: string): Promise<any> {
    const response = await fetch(`${this.config.baseUrl}/instance/fetchInstances?instanceName=${instanceName}`, {
      method: 'GET',
      headers: {
        'apikey': this.config.apiKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao buscar status da instância:', response.status, errorText);
      throw new Error(`Erro ao buscar status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Status da instância:', data);
    return data;
  }

  async deleteInstance(instanceName: string): Promise<void> {
    console.log('Deletando instância:', instanceName);

    const response = await fetch(`${this.config.baseUrl}/instance/delete/${instanceName}`, {
      method: 'DELETE',
      headers: {
        'apikey': this.config.apiKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao deletar instância:', response.status, errorText);
      throw new Error(`Erro ao deletar instância: ${response.status} - ${errorText}`);
    }

    console.log('Instância deletada com sucesso');
  }

  async sendMessage(instanceName: string, number: string, message: string): Promise<any> {
    const payload = {
      number: number,
      options: {
        delay: 1200,
        presence: 'composing'
      },
      textMessage: {
        text: message
      }
    };

    console.log('Enviando mensagem:', { instanceName, number, message });

    const response = await fetch(`${this.config.baseUrl}/message/sendText/${instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.config.apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao enviar mensagem:', response.status, errorText);
      throw new Error(`Erro ao enviar mensagem: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Mensagem enviada:', data);
    return data;
  }

  async logoutInstance(instanceName: string): Promise<void> {
    console.log('Desconectando instância:', instanceName);

    const response = await fetch(`${this.config.baseUrl}/instance/logout/${instanceName}`, {
      method: 'DELETE',
      headers: {
        'apikey': this.config.apiKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao desconectar instância:', response.status, errorText);
      throw new Error(`Erro ao desconectar instância: ${response.status} - ${errorText}`);
    }

    console.log('Instância desconectada com sucesso');
  }
}

// Instância singleton da API Evolution
export const evolutionApi = new EvolutionApiService({
  baseUrl: 'https://api.redenexus.top',
  apiKey: 'e5fe045f841bddf5406357ebea55ea2b'
});
