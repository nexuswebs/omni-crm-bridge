
import { WhatsAppManager } from '@/components/WhatsAppManager';

const WhatsApp = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold">WhatsApp</h1>
        <p className="text-muted-foreground">Gerencie instâncias e mensagens WhatsApp</p>
      </div>
      
      <WhatsAppManager />
    </div>
  );
};

export default WhatsApp;
