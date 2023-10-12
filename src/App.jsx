import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import NotificationContext from "./NotificationContext";
import { useContext } from "react";

const baseUrl = "http://localhost:3001/anecdotes";

const voteAnecdote = (anecdote) =>
  axios.put(`${baseUrl}/${anecdote.id}`, {
    ...anecdote,
    votes: anecdote.votes + 1,
  });

const App = () => {
  const [notification, dispatchNotification] = useContext(NotificationContext);
  const queryClient = useQueryClient();
  const voteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["anecdotes"] }),
  });

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote);
    dispatchNotification({ type: "VOTE", payload: anecdote.content });
    setTimeout(() => dispatchNotification({ type: "CLEAR" }), 5000);
  };

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: () => axios.get(baseUrl).then((result) => result.data),
    retry: 1,
  });

  if (result.isLoading) {
    const anecdotes = [];
    return <div>anecdote service loading</div>;
  }

  if (result.isError) {
    const anecdotes = [];
    return (
      <div>
        anecdote service not available due to problems on the server:{" "}
        {result.error.message}
      </div>
    );
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification message={notification} />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
