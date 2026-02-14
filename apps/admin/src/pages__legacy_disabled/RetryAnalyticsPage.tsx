import React, { useState } from "react";
  import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";


type ReplayProfile = "light" | "medium" | "heavy";

export default function RetryAnalyticsPage() {
  const [profile, setProfile] = useState<ReplayProfile>("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ...rest unchanged
}

