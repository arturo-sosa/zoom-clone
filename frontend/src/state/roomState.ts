import { useStore } from "@nanostores/solid";
import { atom } from "nanostores";
import { createEffect, createResource } from "solid-js";

export type RoomProps = {
  loading: boolean,
  id?: string,
  error?: Error | undefined;
};

export const room = atom<RoomProps>({ loading: true });

export const useRoom = () => {
  const roomState = useStore(room);
  const [roomData] = createResource(async () => {
    const params = new URLSearchParams(window.location.search);
    const paramId = params.get('id');
    const roomPrefix = paramId ? `room/${paramId}` : "room";
    const request = await fetch(`http://localhost:3000/${roomPrefix}`);
    const response = await request.json();

    return response;
  });

  createEffect(() => {
    if (roomData.loading || roomData.error) return;

    const baseUrl = `${window.location.protocol}//${window.location.host}/room`;
    const params = new URLSearchParams(window.location.search);

    params.set('id', roomData().id);
    room.set({
      loading: false,
      error: undefined,
      id: roomData().id
    });

    const newState = `${baseUrl}?${params}`;
    window.history.pushState({ path: newState }, '', newState);
  });

  return roomState;
};

export default useRoom;