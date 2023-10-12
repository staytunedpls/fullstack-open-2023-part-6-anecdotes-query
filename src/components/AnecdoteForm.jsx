import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import NotificationContext from "../NotificationContext";

const baseUrl = "http://localhost:3001/anecdotes";

const postAnecdote = (anecdote) => axios.post(baseUrl, anecdote);

const AnecdoteForm = () => {
  const [notification, dispatchNotification] = useContext(NotificationContext);
  const queryClient = useQueryClient();
  const postAnecdoteMutation = useMutation({
    mutationFn: postAnecdote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["anecdotes"] }),
    onError: (err) => {
      dispatchNotification({
        type: "ERROR",
        payload: err.response.data.error,
      });
      setTimeout(() => dispatchNotification({ type: "CLEAR" }), 5000);
    },
  });
  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    postAnecdoteMutation.mutate({ content, votes: 0 });
    dispatchNotification({ type: "CREATE", payload: content });
    setTimeout(() => dispatchNotification({ type: "CLEAR" }), 5000);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
