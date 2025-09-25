import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

export const Profile = () => {
  return (
    <div className="max-w-3xl space-y-8">
      {/* 1) Personal Information */}
      <section>
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>

        <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName" className="mb-2 block text-sm">
              First Name
            </Label>
            <Input id="firstName" className="h-10" placeholder="First name" />
          </div>

          <div>
            <Label htmlFor="lastName" className="mb-2 block text-sm">
              Last Name
            </Label>
            <Input id="lastName" className="h-10" placeholder="Last name" />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="dob" className="mb-2 block text-sm">
              Date of birth
            </Label>
            <Input id="dob" type="date" className="h-10" />
            <p className="text-xs text-muted-foreground mt-1">Your date of birth is used to calculate your age.</p>
          </div>
        </form>
      </section>

      {/* 2) Contact info */}
      <section>
        <h2 className="text-lg font-semibold">Contact info</h2>
        <p className="text-sm text-muted-foreground">Receive account activity alerts and trip updates by sharing this information.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="phone" className="mb-2 block text-sm">
              Phone number
            </Label>
            <Input id="phone" className="h-10" placeholder="+976 8x xx xxxx" />
          </div>

          <div>
            <Label htmlFor="email" className="mb-2 block text-sm">
              Email address
            </Label>
            <Input id="email" type="email" className="h-10" placeholder="name@example.com" />
          </div>
        </div>
      </section>

      {/* 3) Emergency Contact */}
      <section>
        <h2 className="text-lg font-semibold">Emergency Contact</h2>
        <p className="text-sm text-muted-foreground">In case of emergencies, having someone we can reach out to is essential.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="emgPhone" className="mb-2 block text-sm">
              Phone number
            </Label>
            <Input id="emgPhone" className="h-10" placeholder="+976 8x xx xxxx" />
          </div>

          <div>
            <Label htmlFor="relationship" className="mb-2 block text-sm">
              Relationship
            </Label>
            <Select>
              <SelectTrigger id="relationship" className="h-10">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <Button type="button" className="bg-[#2563EB]">
            Update profile
          </Button>
        </div>
      </section>
    </div>
  );
};
