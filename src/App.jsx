import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const App = () => {
  const handleVote = (anecdote) => {
    console.log("vote");
  };
  const baseUrl = "http://localhost:3001";

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: () =>
      axios.get(`${baseUrl}/anecdotes`).then((result) => result.data),
    retry: 1,
  });

  if (result.isLoading) {
    const anecdotes = [];
    return (
      <div>anecdote service loading</div>
    );
  }

  if (result.isError) {
    const anecdotes = [];
    return (
      <div>anecdote service not available due to problems on the server: {result.error.message}</div>
    );
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
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
