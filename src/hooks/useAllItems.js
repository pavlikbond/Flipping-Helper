import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

export const useAllItems = () => {
  //only call api once per session, otherwise save results to variable for reuse
  const mutation = useMutation({
    mutationKey: ["items"],
    mutationFn: async () => {
      const { data } = await axios.get("https://prices.runescape.wiki/api/v1/osrs/mapping");
      console.log("called api");
      return data;
    },
  });
  //check session storage first
  const sessionItems = sessionStorage.getItem("items");
  if (sessionItems && sessionItems.length > 0) {
    console.log("session storage");
    return { allItems: JSON.parse(sessionItems), isLoading: false, isError: false, refetch: mutation.mutate };
  }
  //if session storage is empty, call api
  else {
    console.log("calling api");
    const { data, isLoading, isError, refetch } = useQuery({
      queryKey: ["items"],
      queryFn: async () => {
        const { data } = await axios.get("https://prices.runescape.wiki/api/v1/osrs/mapping");
        console.log("called api");
        return data;
      },
    });
    //save results to session storage
    if (!isLoading && !isError && data.length > 0) {
      sessionStorage.setItem("items", JSON.stringify(data));
    }
    return { allItems: data, isLoading, isError, refetch };
  }
};
