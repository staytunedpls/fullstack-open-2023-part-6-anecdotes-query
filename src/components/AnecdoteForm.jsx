import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const postAnecdote = (anecdote) => axios.post(baseUrl, anecdote);

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const postAnecdoteMutation = useMutation({
    mutationFn: postAnecdote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["anecdotes"] }),
  });
  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    postAnecdoteMutation.mutate({ content, votes: 0 });
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
