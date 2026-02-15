import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Progress } from "./ui/progress"
import { Heart, MapPin } from "lucide-react"

export function OnBoardingModal() {

  const [step , setStep] = useState(1);
  const progress = (step/2) * 100;

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="mb-4">
              <Progress value={progress} className="h-1" />
            </div>
            <DialogTitle className={"flex items-center gap-3 text-2xl"}>
              {step === 1 ? (
                <>
                <Heart className="w-6 h-6 text-purple-500" />
                What interests you?
                </>
              ) : (
                <>
                <MapPin className="w-6 h-6 text-purple-500" />
                Where are you located? 
                </>
              )}
            </DialogTitle>
            <DialogDescription>
                {step === 1 ? 
              "Select atleast 3 categories to personalize your experience" : 
              "We'll show events happen near you"  
              }
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

