import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

const UpdateUser = () => {

  return (
    <div className="flex flex-col bg-white">
        <p>Хэрэглэгчийн хэсэг</p>
        <div className="p-5 border bg-grey rounded-full w-[100px] h-[100px] flex items-center justify-center">
            <User size={60}/>
        </div>
    </div>
  )
}

export default UpdateUser;