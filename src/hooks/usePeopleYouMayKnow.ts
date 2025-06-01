
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PeopleYouMayKnow } from "@/types/connections";
import { mockPeopleYouMayKnow } from "@/data/mockPeopleYouMayKnow";

export const usePeopleYouMayKnow = () => {
  const { toast } = useToast();
  const [peopleYouMayKnow, setPeopleYouMayKnow] = useState<PeopleYouMayKnow[]>(mockPeopleYouMayKnow);

  const handleSendPersonRequest = (personId: string) => {
    setPeopleYouMayKnow(prev => prev.filter(person => person.id !== personId));
    toast({
      title: "Connection request sent!",
      description: "Your request has been sent successfully.",
    });
  };

  const handleDismissPerson = (personId: string) => {
    setPeopleYouMayKnow(prev => prev.filter(person => person.id !== personId));
    toast({
      title: "Person dismissed",
      description: "This suggestion has been removed.",
    });
  };

  return {
    peopleYouMayKnow,
    handleSendPersonRequest,
    handleDismissPerson,
  };
};
