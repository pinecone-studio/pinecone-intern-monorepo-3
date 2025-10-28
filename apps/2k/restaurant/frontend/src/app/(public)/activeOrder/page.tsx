'use client'; 
import { Header } from "@/components/Header";
import { ActiveOrderContent } from "@/components/sheet/ActiveOrder";


const page = () => {
  return(
    <div>
        <Header/>
        <ActiveOrderContent  onBack={() => console.log('Буцах товч дарлаа')}/>
    </div>
  )
};

export default page;