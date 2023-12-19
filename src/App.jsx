import { useEffect, useState } from "react";
import StartRating from "./StartRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  // 4a32091d
const KEY='4a32091d'
export default function App() {
  const [query, setQuery] = useState("interstellar");

  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const tempQuery='interstellar'
  
  function handleSelectedMovie(id) {
    setSelectedId(id)
  }
  function handleCloseMovie() {
    setSelectedId(null)
  }
  function handleAddWatched(movie) {

    setWatched((watched)=>[...watched,movie])
  }

  function handleDeleteWatched(id) {
    setWatched((watched)=>{
      return watched.filter((item)=> item.imdbID!==id)
    } )
  }

  
  

  // we  want useEect result return synxron that's why 2 function write
  useEffect(()=>{
    const controller=new AbortController()
    async function fetchMovie() {

      try {
        setIsLoader(true)
        setError('')

        const res=await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,          
        {signal: controller.signal}
        )
        
          // console.log(res);
          // if fetching data donot come : create new Error
          if(!res.ok) throw new Error('Something is wrong with fetching movie data')
          const data=await res.json()
        // console.log(data.Search);
        
        //  if film name donot find it : create new Error
        if (data.Response==='False')  throw new Error('Movie not Found')
        
        
          setMovies(data.Search)
          setError("")

      } 

      catch (err) {
        // console.log(err.message);
        if (err.name='AbortError') {
          setError(err.message)
          
        }
        
      }
      finally{
        setIsLoader(false)

      }

    }
    
    if (query.length<3) {
      setMovies([])
      setError("")
       
    }
    handleCloseMovie()
    fetchMovie()

    return function () { controller.abort()   }
      
  },[query])


  return (
    <>
      <Navbar>
         <Search query={query} setQuery={setQuery} />
         <NumResults movies={movies} />
      </Navbar>
      <Main>
       <Box >
         {/* {isLoader? <Load/> : <MovieList movies={movies}/>  }  */}
         {isLoader && <Load/> }
         {!isLoader && !error && <MovieList movies={movies} onSelectMovie={handleSelectedMovie} 
         onCloseMovie={handleCloseMovie} /> }
         {error && <ErrorMessage message={error} />}
       </Box>
       <Box>
         
          {
            selectedId ? <MovieDetails 
            selectedId={selectedId} onCloseMovie={handleCloseMovie} onAddWatched={handleAddWatched}
            onRemoveWatched={handleDeleteWatched}
            watched={watched} /> :
            <>
              <WatcheSummary watched={watched}/>
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched}/>
            </>
          } 
         
       </Box>
       {/* React-router-dom */}
       {/* <Box element={ <MovieList movies={movies}/> } />
        <Box element={ <>
          <WatcheSummary watched={watched}/>
          <WatchedMoviesList watched={watched}/>
        </> } /> */}
      </Main>
    </>
  );
}

function Load() {
  return <h1>Loadding...</h1>
}
function ErrorMessage({message}) {
  return <p className="error">
    <span>🚨</span>
    {message}
  </p>
}

function Navbar({children}) {
  return (
    <nav className="nav-bar">
      <Logo />
       {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({query, setQuery}) {

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({movies}) {
  return (
    <p className="num-results">
      {/* Found <strong>{movies.length}</strong> results */}
    </p>
  );
}

function Main({children}) {
  return (
    <main className="main">
      {children}
    </main>
  );
}

function Box({children}) {
  const [isOpen, setIsOpen] = useState(true);

  {
    /* left bar */
  }
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({movies,onSelectMovie}) {

  return (
    <ul className="list list-movies ">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.Title} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie,onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={()=>onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

/* right bar */

// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatcheSummary watched={watched}/>
//           <WatchedMoviesList watched={watched}/>
          
//         </>
//       )}
//     </div>
//   );
// }


function MovieDetails({selectedId,onCloseMovie,onAddWatched,watched}) {
  const[movie,setMovie]=useState({})
  const[isLoading,setIsLoading]=useState(false)
  const[userRating,setUserRating]=useState('')

  const isRated=watched.map((item)=>item.imdbID).includes(selectedId)
  const watchedUserRating=watched.find((item)=>item.imdbID===selectedId)?.userRating


  const {
    Title:title,
    Year:year,
    Poster:poster,
    Runtime:runtime,imdbRating,
    Plot:plot,
    Released:released,
    Actors:actors,
    Director:director,
    Genre:genre,
  }=movie

// when click esc key hit
  useEffect(function() {

    function callBack(e) {
      if (e.code === 'Escape') {
        onCloseMovie();

      }
    }
  
    document.addEventListener('keydown',callBack);
    return function () {
      document.removeEventListener('keydown',callBack);
    }

  }, [onCloseMovie]);

  useEffect(()=>{
    setIsLoading(true)
    async function getMovieDetails() {
      console.log(selectedId);
      const res=await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
      
      const data=await res.json()
    console.log(data);
    setMovie(data)
    setIsLoading(false)

    }
    getMovieDetails()
    console.log(movie);
    
  },[selectedId])

  useEffect(function () {
    if (!title) return
    document.title= `Movie | ${title}`

    return function ()  { document.title='usePopcorn' }
      
    

  }, [title])



  function handleAdd() {
    const newWatchedMovie={ 
      imdbID:selectedId,
      title,
      year,
      poster,
      imdbRating:Number(imdbRating),
      runtime:Number(runtime.split(' ').at(0)),
      userRating


    }



    onAddWatched(newWatchedMovie)
    onCloseMovie()

  }
  

  return (
        <div className="details">
        {isLoading ? <p className="loader">Loading...</p> : 
    <>
    <header>

    <button className="btn-back" onClick={onCloseMovie}> &larr;  </button>
      <img src={poster} alt={`Poster of ${movie}`} />  
      <div className="details-overview">
        <h2>{title}</h2>
        <p>
          {released}  &bull; {runtime}
        </p>
        <p>{genre}</p>
        <p> <span>🌟</span>
        {imdbRating} IMDb rating
        </p>
        
      </div>

    </header>

    <section>
      <div className="rating">
        <h2>{title}</h2>
      </div>
    {!isRated?  
    <StartRating maxRating={10} size={24} onSetRating={setUserRating} /> 
    : <p>You rated this movie {watchedUserRating} <span>🌟</span> </p> }
    { userRating &&  <button className="btn-add" onClick={handleAdd}>+ Add to list</button> }
    <p>
        <em>{plot}</em>
      </p>
      <p>Starting {actors}</p>
      <p>Directed by {director}</p>
    </section>
    {selectedId}
    </>

  }
    </div>
  )

}

function WatcheSummary({watched}) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({watched,onDeleteWatched}) {
  return <ul className="list">
  {watched.map((movie) => (
    <WatchedMovies movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
  ))}
</ul>
}

function WatchedMovies({movie,onDeleteWatched}) {
  return     <li >
  <img src={movie.poster} alt={`${movie.title} poster`} />
  <h3>{movie.title}</h3>
  <div>
    <p>
      <span>⭐️</span>
      <span>{movie.imdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{movie.userRating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{movie.runtime} min</span>
    </p>
    <button className="btn-delete" onClick={()=>onDeleteWatched(movie.imdbID)}>🗙</button>

  </div>
</li>
}