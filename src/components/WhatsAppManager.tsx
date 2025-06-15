
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Plus } from 'lucide-react';
import { useWhatsAppInstances } from '@/hooks/useWhatsAppInstances';
import { WhatsAppInstanceCard } from '@/components/WhatsAppInstanceCard';
import { CreateInstanceModal } from '@/components/CreateInstanceModal';
import { InstanceConfigModal } from '@/components/InstanceConfigModal';
import { useToast } from '@/hooks/use-toast';

export const WhatsAppManager = () => {
  const { toast } = useToast();
  const {
    instances,
    isLoading,
    createInstance,
    deleteInstance,
    connectInstance,
    disconnectInstance,
    sendTestMessage,
    updateInstance,
  } = useWhatsAppInstances();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);

  const handleConfigureInstance = (instance) => {
    setSelectedInstance(instance);
    setConfigModalOpen(true);
  };

  const handleSaveInstanceConfig = (updatedInstance) => {
    updateInstance(updatedInstance);
    setConfigModalOpen(false);
    toast({
      title: "Configurações salvas!",
      description: "As configurações da instância foram atualizadas.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Smartphone className="w-6 h-6" />
            Gerenciador WhatsApp
          </h2>
          <p className="text-muted-foreground">Gerencie suas instâncias WhatsApp via Evolution API</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Instância
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instances.map((instance) => (
          <WhatsAppInstanceCard
            key={instance.id}
            instance={instance}
            onConnect={connectInstance}
            onDisconnect={disconnectInstance}
            onDelete={deleteInstance}
            onConfigure={handleConfigureInstance}
            onSendTestMessage={sendTestMessage}
            isLoading={isLoading}
          />
        ))}
      </div>

      <CreateInstanceModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateInstance={createInstance}
        isLoading={isLoading}
      />

      <InstanceConfigModal
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
        instance={selectedInstance}
        onSave={handleSaveInstanceConfig}
      />
    </div>
  );
};
