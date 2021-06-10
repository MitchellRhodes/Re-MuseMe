-- CREATE TABLE users(
-- 	id SERIAL PRIMARY KEY,
-- 	name text NOT NULL
-- );


-- CREATE TABLE song_stats(
-- id SERIAL PRIMARY KEY,
-- 	song_id varchar NOT NULL,
-- 	danceability decimal(6,6) NOT NULL CHECK (danceability >= 0 AND danceability <=1), 
-- 	energy decimal(6,6) NOT NULL CHECK (energy >= 0 AND energy <=1),
-- 	speechiness decimal(6,6) NOT NULL CHECK (speechiness >= 0 AND speechiness <=1), 
-- 	acousticness decimal(6,6) NOT NULL CHECK (acousticness >= 0 AND acousticness <=1), 
-- 	instrumentalness decimal(6,6) NOT NULL CHECK (instrumentalness >= 0 AND instrumentalness <=1),
-- 	liveness decimal(6,6) NOT NULL CHECK (liveness >= 0 AND liveness <=1),
-- 	valence decimal(6,6) NOT NULL CHECK (valence >= 0 AND valence <=1)
-- );


-- CREATE TABLE swipes(
-- 	id SERIAL PRIMARY KEY,
-- 	user_id integer NOT NULL REFERENCES users on DELETE CASCADE,
-- 	song_id integer NOT NULL REFERENCES song_stats ON DELETE CASCADE,
-- 	swipe boolean NOT NULL
-- );
