
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PeopleYouMayKnow } from "@/types/connections";
import { mockPeopleYouMayKnow } from "@/data/mockConnections";

export const usePeopleYouMayKnow = () => {
  const { toast } = useToast();
  const [peopleYouMayKnow, setPeopleYouMayKnow] = useState<PeopleYouMayKnow[]>(mockPeopleYouMayKnow);

  const handleSendPersonRequest = (personId: string) => {
    setPeopleYouMayKnow(prev => prev.filter(person => person.id !== personId));
    toast({
      title: "Connection request sent!",
      description: "Your request has been sent.",
    });
  };

  const handleDismissPerson = (personId: string) => {
    setPeopleYouMayKnow(prev => prev.filter(person => person.id !== personId));
    toast({
      title: "Suggestion removed",
      description: "This person won't be suggested again.",
    });
  };

  return {
    peopleYouMayKnow,
    handleSendPersonRequest,
    handleDismissPerson,
  };
};
