import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const AddFoodDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">➕ Хоол нэмэх</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Хоол нэмэх</DialogTitle>
          <DialogDescription>Шинэ хоолны мэдээллийг бөглөнө үү.</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 py-2">
          {/* Хоолны нэр */}
          <div className="grid gap-2">
            <Label htmlFor="foodName">Хоолны нэр</Label>
            <Input id="foodName" name="foodName" placeholder="ж: Taso, Burger Deluxe" />
          </div>

          {/* Үнэ */}
          <div className="grid gap-2">
            <Label htmlFor="price">Үнэ (₮)</Label>
            <Input id="price" name="price" placeholder="ж: 15600" type="number" />
          </div>

          {/* Зураг */}
          <div className="grid gap-2">
            <Label htmlFor="image">Зурагны линк</Label>
            <Input id="image" name="image" placeholder="ж: https://images.unsplash.com/photo-..." type="url" />
          </div>

          {/* Төлөв */}
          <div className="grid gap-2">
            <Label htmlFor="status">Төлөв</Label>
            <Select>
              <SelectTrigger id="status">
                <SelectValue placeholder="Төлөв сонгох" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Идэвхтэй</SelectItem>
                <SelectItem value="inactive">Идэвхгүй</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Цуцлах</Button>
            </DialogClose>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Хадгалах
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}