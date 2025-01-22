import { useState, useEffect } from 'preact/hooks';
import * as streamingAvailability from "streaming-availability";
import moviesJson from '../data/movies.json';

export default function Card() {
    // logic

    const client = new streamingAvailability.Client(new streamingAvailability.Configuration({
        apiKey: import.meta.env.STREAMING_AVAILABILITY_API_KEY
    }));

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            let array = [];
            for await (const movie of moviesJson[2025]) {
            client.showsApi.getShow({
                id: movie.id,
                country: "us"
            }).then((response)=>{
                array.push({
                    "title": response.title,
                    "director": response.directors[0],
                    "runtime": response.runtime,
                    "poster": response.imageSet.verticalPoster.w720,
                    "streamingOptions": {
                        "name": response.streamingOptions?.us[0]?.service?.name,
                        "link": response.streamingOptions?.us[0]?.link
                    }
                })
            }).catch((error)=>{
                console.error(error);
            })
            }
            setData(array);
        };
        fetchMovies();
      }, []);
    

    return (
        <>
        {data.map((movie)=>{
            <div class="movie-card">
                <figure>
                    <img src={movie.imgUrl}/>
                </figure>
                <div class="movie-info">
                    <h1>{movie.title}</h1>
                    <p>{movie.directors}</p>
                    <p>{convertRuntime(movie.runtime)}</p>
                    <div class="streaming-container">
                        <button type="button">{movie.streamingOptions}</button>
                    </div>
                </div>
            </div>
        })}
        </>
    )
}