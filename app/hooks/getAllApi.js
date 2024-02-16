import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../lib/config";

const ApiLeagues = `${API}/leagues/get-leagues`;



export const useGetLeagues = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['Leagues'],
    queryFn: () => axios.get(`${API}/leagues/get-leagues`).then((res) => res.data.leagues),
  });
  return { data, isLoading, isError };
};

export const useGetTeams = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['Teams'],
    queryFn: () => axios.get(`${API}/teams/get-teams`).then((res) => res.data.teams),
  });
  return { data, isLoading, isError };
};
export const useGetGroups = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['Groups'],
    queryFn: () => axios.get(`${API}/groups/get-groups`).then((res) => res.data.groups),
  });
  return { data, isLoading, isError };
};
export const useGetPlayers = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['Players'],
    queryFn: () => axios.get(`${API}/players/get-players`).then((res) => res.data.players),
  });
  return { data, isLoading, isError };
};

export const useGetLeagueById = (leagueId) => {
  return useQuery({
    queryKey: ['League', leagueId],
    queryFn: () => axios.get(`${API}/leagues/get-league/${leagueId}`).then((res) => res.data),
    enabled: !!leagueId,
  });
};



