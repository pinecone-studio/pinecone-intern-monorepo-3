import Image from 'next/image';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ContactAgentProps {
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  agentImage: string;
}

const ContactAgent = ({ agentName, agentPhone, agentEmail: _agentEmail, agentImage }: ContactAgentProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Холбоо барих</h3>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
            <Image
              src={agentImage}
              alt={agentName}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{agentName}</div>
            <div className="text-sm text-gray-600">Үл хөдлөх хөрөнгийн зөвлөх</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button className="w-full flex items-center justify-center">
            <Phone className="h-4 w-4 mr-2" />
            {agentPhone}
          </Button>
          
          <Button variant="outline" className="w-full flex items-center justify-center">
            <Mail className="h-4 w-4 mr-2" />
            И-мэйл илгээх
          </Button>
          
          <Button variant="outline" className="w-full flex items-center justify-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            Чатлах
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactAgent;
