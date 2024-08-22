import { useEffect, useState } from "react";

import { useForm, useWatch } from "react-hook-form";

import { TReplicationSiteFormValues } from "../models/replicationSite";

export const useRangeFieldValue = (
  control: ReturnType<typeof useForm<TReplicationSiteFormValues>>["control"],
) => {
  const startReplicationRange = useWatch({
    control,
    name: "startReplicationRange",
  });
  const endReplicationRange = useWatch({
    control,
    name: "endReplicationRange",
  });

  const [rangeFieldValue, setRangeFieldValue] = useState("");

  useEffect(() => {
    if (
      startReplicationRange &&
      !isNaN(startReplicationRange) &&
      endReplicationRange &&
      !isNaN(endReplicationRange)
    ) {
      setRangeFieldValue(`[${startReplicationRange}M_${endReplicationRange}M]`);
    } else {
      setRangeFieldValue("");
    }
  }, [startReplicationRange, endReplicationRange]);

  return rangeFieldValue;
};
