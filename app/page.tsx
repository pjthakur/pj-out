"use client";

import React, { useState, useEffect, useRef } from "react";
import { AiOutlineStar, AiFillStar, AiOutlineClose } from "react-icons/ai";
import { IoSearch, IoClose } from "react-icons/io5";
import {
  AiOutlineHome,
  AiOutlineFire,
  AiOutlineInfoCircle,
} from "react-icons/ai";

import {
  FaRegHeart,
  FaHeart,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { BiMoviePlay } from "react-icons/bi";
import { MdLocalMovies } from "react-icons/md";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  genre_ids: number[];
  release_date: string;
  overview: string;
  backdrop_path?: string;
}

interface MovieDetails {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  release_date: string;
  overview: string;
  runtime: number;
  tagline: string;
  production_companies: { id: number; name: string; logo_path: string }[];
}

interface Genre {
  id: number;
  name: string;
}

interface Review {
  id: number;
  author: string;
  content: string;
  rating: number;
  date: string;
  avatar: string;
}

const mockGenres: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Eternal Shadows",
    poster_path:
      "https://images.unsplash.com/photo-1726137569906-14f8079861fa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8",
    backdrop_path:
      "https://images.unsplash.com/photo-1743484977289-22999cb8c001?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
    vote_average: 9.3,
    genre_ids: [18, 80],
    release_date: "2024-09-23",
    overview:
      "A mysterious tale of two unlikely companions who discover the true meaning of friendship in the darkest of times, challenging everything they thought they knew about loyalty and sacrifice.",
  },
  
  {
    id: 4,
    title: "Crimson Nights",
    poster_path:
      "https://images.unsplash.com/photo-1743423054685-4b109da0403a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8",
    backdrop_path:
      "https://images.unsplash.com/photo-1743917836519-44f2b58deed3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D",
    vote_average: 8.9,
    genre_ids: [80, 53],
    release_date: "2024-10-14",
    overview:
      "When the city's underworld collides with high society, four interconnected stories reveal the thin line between justice and revenge in this gripping urban thriller.",
  },
  {
    id: 5,
    title: "Digital Dreams",
    poster_path:
      "https://plus.unsplash.com/premium_photo-1744395627449-fc1cc8c1fa7e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D",
    backdrop_path:
      "https://images.unsplash.com/photo-1745236781096-be405b87d05c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D",
    vote_average: 8.8,
    genre_ids: [28, 878, 12],
    release_date: "2024-07-16",
    overview:
      "A brilliant hacker discovers that reality itself might be programmable, leading to a mind-bending journey through virtual worlds where the impossible becomes possible.",
  },
  {
    id: 6,
    title: "Midnight Rebellion",
    poster_path:
      "https://images.unsplash.com/photo-1726607424623-6d9fee974241?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMXx8fGVufDB8fHx8fA%3D%3D",
    backdrop_path:
      "https://images.unsplash.com/photo-1745770998338-eb50b0c89b16?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzOHx8fGVufDB8fHx8fA%3D%3D",
    vote_average: 8.8,
    genre_ids: [18, 53],
    release_date: "2024-10-15",
    overview:
      "A secret underground movement challenges the established order in this powerful drama about courage, identity, and the price of standing up for what you believe in.",
  },
  {
    id: 7,
    title: "The Wanderer's Path",
    poster_path:
      "https://images.unsplash.com/photo-1745905932716-431e50eac74b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NHx8fGVufDB8fHx8fA%3D%3D",
    backdrop_path:
      "https://images.unsplash.com/photo-1735825764485-93a381fd5779?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1MXx8fGVufDB8fHx8fA%3D%3D",
    vote_average: 8.8,
    genre_ids: [18, 10749],
    release_date: "2024-07-06",
    overview:
      "An inspiring journey of self-discovery follows a young traveler who learns that the most important destinations are often found within ourselves.",
  },
  {
    id: 8,
    title: "Neon Prophecy",
    poster_path:
      "https://images.unsplash.com/photo-1745750747233-c09276a878b3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1N3x8fGVufDB8fHx8fA%3D%3D",
    backdrop_path:
      "https://images.unsplash.com/photo-1667312939934-60fc3bfa4ec0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym9va3N8ZW58MHx8MHx8fDA%3D",
    vote_average: 8.7,
    genre_ids: [878, 28],
    release_date: "2024-03-31",
    overview:
      "In a cyberpunk future, a former soldier uncovers a conspiracy that threatens to reshape humanity's destiny in this visually stunning sci-fi adventure.",
  },
  {
    id: 9,
    title: "Silent Echoes",
    poster_path:
      "https://plus.unsplash.com/premium_photo-1669652639356-f5cb1a086976?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backdrop_path:
      "https://plus.unsplash.com/premium_photo-1677187301660-5e557d9c0724?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9va3N8ZW58MHx8MHx8fDA%3D",
    vote_average: 8.7,
    genre_ids: [18, 80],
    release_date: "2024-09-21",
    overview:
      "A masterful psychological drama exploring the complex relationships between memory, truth, and the stories we tell ourselves to survive.",
  },
  {
    id: 10,
    title: "The Mind's Edge",
    poster_path:
      "https://images.unsplash.com/photo-1522407183863-c0bf2256188c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJvb2tzfGVufDB8fDB8fHww",
    backdrop_path:
      "https://images.unsplash.com/photo-1521056787327-165dc2a32836?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJvb2tzfGVufDB8fDB8fHww",
    vote_average: 8.6,
    genre_ids: [80, 18, 53],
    release_date: "2024-02-14",
    overview:
      "A brilliant psychiatrist must unravel a complex case that blurs the lines between patient and doctor, sanity and madness, in this intense psychological thriller.",
  },
  {
    id: 11,
    title: "Cosmic Guardians",
    poster_path:
      "https://images.unsplash.com/photo-1705721357357-ab87523248f7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvb2tzfGVufDB8fDB8fHww",
    backdrop_path:
      "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Ym9va3N8ZW58MHx8MHx8fDA%3D",
    vote_average: 8.6,
    genre_ids: [12, 28, 878],
    release_date: "2024-05-21",
    overview:
      "An epic space opera following a diverse crew of heroes as they protect the galaxy from an ancient threat that awakens after millennia of slumber.",
  },
  {
    id: 12,
    title: "Forgotten Heroes",
    poster_path:
      "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3N8ZW58MHx8MHx8fDA%3D",
    backdrop_path:
      "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9va3N8ZW58MHx8MHx8fDA%3D",
    vote_average: 8.6,
    genre_ids: [18, 36, 10752],
    release_date: "2024-07-24",
    overview:
      "A powerful war drama that honors the untold stories of courage and sacrifice, following a group of soldiers on an impossible mission behind enemy lines.",
  },
  {
    id: 13,
    title: "Beyond the Stars",
    poster_path:
      "https://images.unsplash.com/photo-1726137569906-14f8079861fa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8",
    backdrop_path:
      "https://images.unsplash.com/photo-1743484977289-22999cb8c001?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
    vote_average: 8.6,
    genre_ids: [12, 18, 878],
    release_date: "2024-11-07",
    overview:
      "A breathtaking journey through space and time as explorers search for a new home for humanity, discovering that the universe holds more mysteries than they ever imagined.",
  },
  {
    id: 14,
    title: "Realm of Legends",
    poster_path:
      "https://images.unsplash.com/photo-1743423054685-4b109da0403a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8",
    backdrop_path:
      "https://images.unsplash.com/photo-1743917836519-44f2b58deed3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D",
    vote_average: 8.8,
    genre_ids: [12, 14, 28],
    release_date: "2024-12-19",
    overview:
      "An epic fantasy adventure where a young hero must unite the scattered kingdoms to prevent an ancient evil from plunging the world into eternal darkness.",
  },
  {
    id: 15,
    title: "Wild Heart",
    poster_path:
      "https://plus.unsplash.com/premium_photo-1744395627449-fc1cc8c1fa7e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D",
    backdrop_path:
      "https://images.unsplash.com/photo-1745236781096-be405b87d05c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D",
    vote_average: 8.5,
    genre_ids: [16, 10751, 18],
    release_date: "2024-06-24",
    overview:
      "A heartwarming animated tale about a young animal who learns to embrace their unique gifts and discovers the true meaning of family and belonging in the wild.",
  },
  {
    id: 16,
    title: "Seven Shadows",
    poster_path:
      "https://images.unsplash.com/photo-1726607424623-6d9fee974241?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMXx8fGVufDB8fHx8fA%3D%3D",
    backdrop_path:
      "https://images.unsplash.com/photo-1745770998338-eb50b0c89b16?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzOHx8fGVufDB8fHx8fA%3D%3D",
    vote_average: 8.6,
    genre_ids: [28, 18, 36],
    release_date: "2024-04-26",
    overview:
      "A legendary warrior assembles a team of skilled fighters to protect a peaceful village from ruthless invaders in this epic tale of honor and sacrifice.",
  },
  {
    id: 17,
    title: "The Double Cross",
    poster_path:
      "https://images.unsplash.com/photo-1745905932716-431e50eac74b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NHx8fGVufDB8fHx8fA%3D%3D",
    backdrop_path:
      "https://images.unsplash.com/photo-1735825764485-93a381fd5779?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1MXx8fGVufDB8fHx8fA%3D%3D",
    vote_average: 8.5,
    genre_ids: [80, 18, 53],
    release_date: "2024-10-06",
    overview:
      "A gripping crime thriller where an undercover agent and a criminal informant play a dangerous game of cat and mouse in the city's corrupt underworld.",
  },
  {
    id: 18,
    title: "Mystic Journey",
    poster_path:
      "https://images.unsplash.com/photo-1745750747233-c09276a878b3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1N3x8fGVufDB8fHx8fA%3D%3D",
    backdrop_path:
      "https://images.unsplash.com/photo-1667312939934-60fc3bfa4ec0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym9va3N8ZW58MHx8MHx8fDA%3D",
    vote_average: 8.5,
    genre_ids: [16, 10751, 14],
    release_date: "2024-07-20",
    overview:
      "A magical adventure following a young dreamer who discovers a hidden world where imagination comes to life and every story has the power to change reality.",
  },
  {
    id: 2,
    title: "The Legacy",
    poster_path:
      "https://plus.unsplash.com/premium_photo-1669652639356-f5cb1a086976?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backdrop_path:
      "https://plus.unsplash.com/premium_photo-1677187301660-5e557d9c0724?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9va3N8ZW58MHx8MHx8fDA%3D",
    vote_average: 9.2,
    genre_ids: [18, 80],
    release_date: "2024-03-24",
    overview:
      "A powerful family saga spanning three generations, exploring themes of power, loyalty, and the price of ambition in this critically acclaimed drama.",
  },
  {
    id: 3,
    title: "Shadow Knight",
    poster_path:
      "https://images.unsplash.com/photo-1522407183863-c0bf2256188c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJvb2tzfGVufDB8fDB8fHww",
    backdrop_path:
      "https://images.unsplash.com/photo-1521056787327-165dc2a32836?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJvb2tzfGVufDB8fDB8fHww",
    vote_average: 9.0,
    genre_ids: [28, 80, 18],
    release_date: "2024-07-18",
    overview:
      "A masked vigilante must confront their greatest nemesis in this dark and compelling superhero thriller that explores the fine line between justice and vengeance.",
  },
  {
    id: 19,
    title: "Hidden Truths",
    poster_path:
      "https://images.unsplash.com/photo-1705721357357-ab87523248f7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvb2tzfGVufDB8fDB8fHww",
    backdrop_path:
      "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Ym9va3N8ZW58MHx8MHx8fDA%3D",
    vote_average: 8.5,
    genre_ids: [35, 53, 18],
    release_date: "2024-05-30",
    overview:
      "A thought-provoking social thriller that exposes the hidden connections between seemingly unrelated lives, revealing how secrets can bind us together or tear us apart.",
  },
  {
    id: 20,
    title: "Iron Will",
    poster_path:
      "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3N8ZW58MHx8MHx8fDA%3D",
    backdrop_path:
      "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9va3N8ZW58MHx8MHx8fDA%3D",
    vote_average: 8.5,
    genre_ids: [28, 18, 36],
    release_date: "2024-05-05",
    overview:
      "An inspiring tale of determination and courage as a former warrior seeks redemption by protecting the innocent against overwhelming odds in this action-packed epic.",
  },
];

const mockReviews: Record<number, Review[]> = {
  1: [
    {
      id: 101,
      author: "CinemaFan87",
      content:
        "The Shawshank Redemption is a masterpiece of storytelling. The performances by Tim Robbins and Morgan Freeman are outstanding, and the film's message about hope and redemption is timeless. This movie deserves every bit of praise it receives.",
      rating: 5,
      date: "2023-10-15",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      id: 102,
      author: "MovieCritic2000",
      content:
        "Frank Darabont's direction is impeccable. The way he brings Stephen King's novella to life is nothing short of brilliant. The cinematography, the score, and the performances all come together to create a truly profound cinematic experience.",
      rating: 5,
      date: "2023-09-22",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
      id: 103,
      author: "FilmBuff456",
      content:
        "This film has stayed with me for years. Its exploration of the human spirit in the face of injustice is deeply moving. The friendship between Andy and Red is one of the most authentic relationships ever portrayed on screen.",
      rating: 4.5,
      date: "2023-11-05",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
  ],
  2: [
    {
      id: 201,
      author: "ClassicMovieLover",
      content:
        "The Godfather stands as the pinnacle of filmmaking. Coppola's direction, coupled with Marlon Brando's iconic performance, creates a cinematic experience like no other. This film defined the gangster genre.",
      rating: 5,
      date: "2023-08-12",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    },
    {
      id: 202,
      author: "FilmHistorian",
      content:
        "The cultural impact of this film cannot be overstated. From its quotable lines to its memorable scenes, The Godfather has embedded itself into our collective consciousness. A true masterpiece of American cinema.",
      rating: 5,
      date: "2023-07-18",
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
    },
  ],
  3: [
    {
      id: 301,
      author: "BatmanFanatic",
      content:
        "Christopher Nolan redefined the superhero genre with The Dark Knight. Heath Ledger's performance as the Joker is absolutely haunting and deserved every accolade it received. This film transcends its genre.",
      rating: 5,
      date: "2023-09-30",
      avatar:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop",
    },
    {
      id: 302,
      author: "FilmAnalyst",
      content:
        "The moral complexity of this film is what sets it apart. It challenges viewers to question the nature of heroism and the thin line between order and chaos. Technically brilliant and thematically rich.",
      rating: 4.5,
      date: "2023-08-14",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
  ],
};

const defaultReviews: Review[] = [
  {
    id: 901,
    author: "MovieEnthusiast",
    content:
      "This film is a compelling piece of cinema that showcases outstanding performances and masterful direction. The narrative is engaging from start to finish, and the visual storytelling is top-notch.",
    rating: 4,
    date: "2023-10-05",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    id: 902,
    author: "CinemaCritic",
    content:
      "A truly memorable film experience. The screenplay is brilliantly crafted, with dialogue that feels both authentic and impactful. The character development is nuanced, allowing viewers to form genuine connections with the protagonists.",
    rating: 4.5,
    date: "2023-09-12",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
];

const avatarOptions = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
];

function App() {
  const [movies, setMovies] = useState<Movie[]>(mockMovies);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(mockMovies);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedRating, setSelectedRating] = useState("All Ratings");
  const [genres] = useState<Genre[]>(mockGenres);
  const [years, setYears] = useState<string[]>([]);
  const [ratings, setRatings] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [favoriteMovies, setFavoriteMovies] = useState<number[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("home");
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  const [userReviews, setUserReviews] = useState<Record<number, Review[]>>({
    ...mockReviews,
  });
  const [newReview, setNewReview] = useState({
    author: "",
    content: "",
    rating: 5,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscriptionMessage, setShowSubscriptionMessage] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const trendingCarouselRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const moviesPerPage = 8;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const startAutoScroll = () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }

      autoScrollTimerRef.current = setInterval(() => {
        if (!autoScrollPaused && trendingCarouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } =
            trendingCarouselRef.current;
          const newScrollLeft = scrollLeft + 2;

          if (scrollLeft >= scrollWidth - clientWidth - 2) {
            trendingCarouselRef.current.scrollTo({
              left: 0,
              behavior: "auto",
            });
          } else {
            trendingCarouselRef.current.scrollLeft = newScrollLeft;
          }
        }
      }, 30);
    };

    startAutoScroll();

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [autoScrollPaused]);

  useEffect(() => {
    const fetchYears = () => {
      const currentYear = new Date().getFullYear();
      const years = ["All Years"];
      for (let i = currentYear; i >= 1970; i--) {
        years.push(i.toString());
      }
      setYears(years);
    };

    const fetchRatings = () => {
      const ratings = ["All Ratings"];
      for (let i = 9; i >= 0; i--) {
        ratings.push(i.toString());
      }
      setRatings(ratings);
    };

    fetchYears();
    fetchRatings();
  }, []);

  useEffect(() => {
    let filtered = [...movies];

    if (searchTerm.trim()) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }

    if (selectedGenre !== "All Genres") {
      const genreId = genres.find((g) => g.name === selectedGenre)?.id;
      if (genreId) {
        filtered = filtered.filter((movie) =>
          movie.genre_ids.includes(genreId)
        );
      }
    }

    if (selectedYear !== "All Years") {
      filtered = filtered.filter(
        (movie) =>
          new Date(movie.release_date).getFullYear().toString() === selectedYear
      );
    }

    if (selectedRating !== "All Ratings") {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter((movie) => movie.vote_average >= minRating);
    }

    setFilteredMovies(filtered);
    setTotalPages(Math.ceil(filtered.length / moviesPerPage));
    setCurrentPage(1);
  }, [searchTerm, selectedGenre, selectedYear, selectedRating, movies, genres]);

  const getCurrentPageMovies = () => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    return filteredMovies.slice(startIndex, endIndex);
  };

  const getMovieDetails = (movieId: number) => {
    const movie = movies.find((m) => m.id === movieId);
    if (movie) {
      const movieGenres = movie.genre_ids.map((genreId) => {
        const genre = genres.find((g) => g.id === genreId);
        return genre || { id: genreId, name: "Unknown" };
      });

      const details: MovieDetails = {
        ...movie,
        genres: movieGenres,
        runtime: 120 + Math.floor(Math.random() * 60),
        tagline: "An unforgettable journey",
        production_companies: [
          { id: 1, name: "MovieFlix Studios", logo_path: "" },
          { id: 2, name: "Cinema Productions", logo_path: "" },
        ],
      };
      setSelectedMovie(details);
      setActiveTab("details");
    }
  };

  const scrollTrending = (direction: "left" | "right") => {
    setAutoScrollPaused(true);

    if (trendingCarouselRef.current) {
      const { scrollLeft, clientWidth } = trendingCarouselRef.current;
      // Calculate card width including margins based on screen size
      // Mobile: full width, Tablet: half width, Desktop: 1/3 width
      const cardWidth = window.innerWidth < 640 ? clientWidth : 
                      window.innerWidth < 1024 ? clientWidth / 2 : 
                      clientWidth / 3;
      
      const scrollTo =
        direction === "left"
          ? scrollLeft - cardWidth
          : scrollLeft + cardWidth;

      trendingCarouselRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });

      setTimeout(() => {
        setAutoScrollPaused(false);
      }, 3000);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSearchFocused(true);
  };

  const handleSearchResultClick = (movie: Movie) => {
    getMovieDetails(movie.id);
    setSearchTerm("");
    setSearchFocused(false);
    setMobileSearchOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRating(e.target.value);
  };

  const handleResetFilters = () => {
    setSelectedGenre("All Genres");
    setSelectedYear("All Years");
    setSelectedRating("All Ratings");
    setCurrentPage(1);
  };

  const hasActiveFilters = () => {
    return (
      selectedGenre !== "All Genres" ||
      selectedYear !== "All Years" ||
      selectedRating !== "All Ratings"
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: document.getElementById("popular")?.offsetTop || 800,
      behavior: "smooth",
    });
  };

  const handleMovieClick = (movie: Movie) => {
    getMovieDetails(movie.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseDetails = () => {
    setSelectedMovie(null);
    setActiveTab("home");
  };

  const handleNavigation = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);

    if (tabId !== "details" && selectedMovie) {
      handleCloseDetails();
    }

    const element = document.getElementById(tabId);
    if (element) {
      window.scrollTo({
        top: tabId === "home" ? 0 : element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  const handleAddToFavorites = (movieId: number) => {
    if (!favoriteMovies.includes(movieId)) {
      setFavoriteMovies([...favoriteMovies, movieId]);
    }
  };

  const handleRemoveFromFavorites = (movieId: number) => {
    setFavoriteMovies(favoriteMovies.filter((id) => id !== movieId));
  };

  const handleMarkAsWatched = (movieId: number) => {
    if (!watchedMovies.includes(movieId)) {
      setWatchedMovies([...watchedMovies, movieId]);
    } else {
      setWatchedMovies(watchedMovies.filter((id) => id !== movieId));
    }
  };

  const handleReviewSubmit = (e: React.FormEvent, movieId: number) => {
    e.preventDefault();

    if (!newReview.author.trim() || !newReview.content.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const randomAvatar =
      avatarOptions[Math.floor(Math.random() * avatarOptions.length)];

    const review: Review = {
      id: Math.floor(Math.random() * 10000),
      author: newReview.author,
      content: newReview.content,
      rating: newReview.rating,
      date: new Date().toISOString().split("T")[0],
      avatar: randomAvatar,
    };

    const updatedReviews = { ...userReviews };

    if (updatedReviews[movieId]) {
      updatedReviews[movieId] = [...updatedReviews[movieId], review];
    } else {
      updatedReviews[movieId] = [review];
    }

    setUserReviews(updatedReviews);

    setNewReview({
      author: "",
      content: "",
      rating: 5,
    });
  };

  const handleReviewChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: name === "rating" ? parseFloat(value) : value,
    });
  };

  const getMovieReviews = (movieId: number): Review[] => {
    return userReviews[movieId] || defaultReviews;
  };

  const getGenreName = (genreId: number): string => {
    return genres.find((g) => g.id === genreId)?.name || "Unknown";
  };

  const formattedRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleNewsletterSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail.trim()) {
      alert("Please enter your email address");
      return;
    }
    
    if (!emailRegex.test(newsletterEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    // Simulate subscription
    setIsSubscribed(true);
    setShowSubscriptionMessage(true);
  };

  const handleNewsletterEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewsletterEmail(e.target.value);
    // Reset subscription status if user changes email
    if (isSubscribed) {
      setIsSubscribed(false);
    }
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-white overflow-x-hidden font-inter">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0f]/90 backdrop-blur-xl shadow-2xl border-b border-gray-800/30"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
        } py-3 md:py-4 ${!scrolled ? 'md:py-5' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center z-30 flex-shrink-0">
              <div className="relative group">
                <BiMoviePlay className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 text-red-500 transition-all duration-300 group-hover:text-red-400 group-hover:scale-110" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-brand text-white tracking-wide">
                Movie<span className="text-red-500">Flix</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {[
                { id: "home", label: "Home" },
                { id: "trending", label: "Trending" },
                { id: "popular", label: "Popular" },
                { id: "about", label: "About" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`relative px-4 py-2 text-lg font-subheading transition-all duration-300 cursor-pointer group ${
                    activeTab === item.id
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300 ${
                      activeTab === item.id
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </button>
              ))}
            </nav>

            {/* Desktop Search */}
            <div className="hidden md:block relative" ref={searchRef}>
              <div
                className={`flex items-center transition-all duration-500 ease-out ${
                  searchFocused ? "w-96" : "w-72"
                }`}
              >
                <div className="relative flex-grow">
                  <input
                    type="text"
                    className={`w-full bg-white/5 backdrop-blur-md text-white placeholder-gray-400 border-2 rounded-2xl py-3 pl-12 pr-4 focus:outline-none transition-all duration-300 ${
                      searchFocused
                        ? "border-red-500/50 shadow-lg shadow-red-500/20 bg-white/10"
                        : "border-gray-700/50 hover:border-gray-600/50"
                    }`}
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={handleSearch}
                    onFocus={() => setSearchFocused(true)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <IoSearch
                      className={`transition-all duration-300 ${
                        searchFocused
                          ? "text-red-500 scale-110"
                          : "text-gray-400"
                      } w-5 h-5`}
                    />
                  </div>
                  {searchTerm && (
                    <button
                      className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer group"
                      onClick={() => {
                        setSearchTerm("");
                        setSearchResults([]);
                      }}
                    >
                      <IoClose className="text-gray-400 hover:text-white w-5 h-5 transition-colors" />
                    </button>
                  )}
                </div>
              </div>

              {searchFocused && searchResults.length > 0 && (
                <div className="absolute mt-3 w-full bg-[#0a0a0f]/95 backdrop-blur-2xl border border-gray-700/50 rounded-2xl shadow-2xl z-[60] overflow-hidden">
                  <div className="max-h-80 overflow-y-auto py-3">
                    {searchResults.map((movie, index) => (
                      <div
                        key={movie.id}
                        className="flex items-center p-4 cursor-pointer hover:bg-white/5 transition-all duration-200 group"
                        onClick={() => handleSearchResultClick(movie)}
                      >
                        <div className="relative overflow-hidden rounded-lg">
                          <img
                            src={movie.poster_path}
                            alt={movie.title}
                            className="w-12 h-16 object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <h4 className="font-medium text-white group-hover:text-red-400 transition-colors">
                            {movie.title}
                          </h4>
                          <div className="flex items-center text-sm text-gray-400 mt-1">
                            <span>
                              {new Date(movie.release_date).getFullYear()}
                            </span>
                            <span className="mx-2">•</span>
                            <div className="flex items-center">
                              <AiFillStar className="text-yellow-500 mr-1" />
                              <span>{movie.vote_average}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center space-x-2 z-30 flex-shrink-0">
              <button
                className="p-2.5 rounded-full bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              >
                <IoSearch
                  className={`w-5 h-5 transition-all duration-300 ${
                    mobileSearchOpen
                      ? "text-red-500"
                      : "text-white group-hover:text-red-400"
                  }`}
                />
              </button>

              <button
                className="p-2.5 rounded-full bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <div className="w-5 h-5 flex flex-col justify-center items-center">
                  <span
                    className={`w-4 h-0.5 bg-white block transition-all duration-300 transform ${
                      mobileMenuOpen ? "rotate-45 translate-y-0.5" : "mb-1"
                    }`}
                  ></span>
                  <span
                    className={`w-4 h-0.5 bg-white block transition-all duration-300 ${
                      mobileMenuOpen ? "opacity-0" : "mb-1"
                    }`}
                  ></span>
                  <span
                    className={`w-4 h-0.5 bg-white block transition-all duration-300 transform ${
                      mobileMenuOpen ? "-rotate-45 -translate-y-0.5" : ""
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
            mobileSearchOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-6 pt-4 bg-black/20 backdrop-blur-sm border-t border-gray-800/30">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-white/5 backdrop-blur-md text-white placeholder-gray-400 border-2 border-gray-700/50 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-red-500/50 transition-all duration-300"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <IoSearch className="text-gray-400 w-5 h-5" />
              </div>
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
                  onClick={() => {
                    setSearchTerm("");
                    setSearchResults([]);
                  }}
                >
                  <IoClose className="text-gray-400 hover:text-white w-5 h-5" />
                </button>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="mt-4 bg-[#0a0a0f]/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
                <div className="max-h-60 overflow-y-auto py-2">
                  {searchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center p-3 cursor-pointer hover:bg-white/5 transition-colors duration-200"
                      onClick={() => handleSearchResultClick(movie)}
                    >
                      <img
                        src={movie.poster_path}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded-lg"
                      />
                      <div className="ml-3">
                        <h4 className="font-medium text-white">
                          {movie.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-400">
                          <span>
                            {new Date(movie.release_date).getFullYear()}
                          </span>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <AiFillStar className="text-yellow-500 mr-1" />
                            <span>{movie.vote_average}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

  
          <div className="relative w-full h-full bg-gradient-to-br from-[#0a0a0f]/95 via-[#12121a]/90 to-black/95 backdrop-blur-xl">
   
            <div className="absolute top-6 right-6 z-10">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group"
              >
                <AiOutlineClose className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
              </button>
            </div>

   
            <div className="h-20"></div>

         
            <div className="flex flex-col items-center justify-center px-8 py-12 space-y-6">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <BiMoviePlay className="w-12 h-12 mr-3 text-red-500" />
                  <h2 className="text-3xl font-brand text-white">
                    Movie<span className="text-red-500">Flix</span>
                  </h2>
                </div>
                <p className="text-gray-400">Your premium movie destination</p>
              </div>

              {[
                {
                  id: "home",
                  label: "Home",
                  icon: <AiOutlineHome className="w-6 h-6" />,
                },
                {
                  id: "trending",
                  label: "Trending",
                  icon: <AiOutlineFire className="w-6 h-6" />,
                },
                {
                  id: "popular",
                  label: "Popular",
                  icon: <AiFillStar className="w-6 h-6" />,
                },
                {
                  id: "about",
                  label: "About",
                  icon: <AiOutlineInfoCircle className="w-6 h-6" />,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full max-w-sm py-5 px-8 text-xl font-subheading rounded-2xl transition-all duration-300 flex items-center justify-center space-x-4 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25"
                      : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-gray-700/30"
                  }`}
                >
                  <span
                    className={`transition-all duration-300 ${
                      activeTab === item.id ? "text-white" : "text-red-400"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

     
           
          </div>
        </div>
      )}
      <main className="flex-1 pt-16 md:pt-24">
        {selectedMovie ? (
          <div className="bg-[#0a0a0f] text-white min-h-screen">
            <div className="relative">
              {selectedMovie.backdrop_path && (
                <div className="absolute inset-0 h-[100vh] md:h-[70vh]">
                  <div className="absolute inset-0 bg-black/30 z-10"></div>
                  <img
                    src={selectedMovie.backdrop_path}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent z-10"></div>
                </div>
              )}

              <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row justify-between mb-8 gap-6">
                  <button
                    onClick={handleCloseDetails}
                    className="bg-[#191920]/80 backdrop-blur-sm hover:bg-[#20202a] cursor-pointer text-white font-medium py-3 px-6 rounded-full flex items-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 12H5M12 19L5 12L12 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Back to Movies
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-1/3">
                    <div className="relative group rounded-2xl overflow-hidden shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <img
                          src={selectedMovie.poster_path}
                          alt={selectedMovie.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            favoriteMovies.includes(selectedMovie.id)
                              ? handleRemoveFromFavorites(selectedMovie.id)
                              : handleAddToFavorites(selectedMovie.id);
                          }}
                          className={`p-3 rounded-full cursor-pointer ${
                            favoriteMovies.includes(selectedMovie.id)
                              ? "bg-red-600/80 backdrop-blur-sm"
                              : "bg-black/50 backdrop-blur-sm"
                          } hover:bg-red-600/80 transition-all duration-300 group/btn flex items-center justify-center`}
                        >
                          {favoriteMovies.includes(selectedMovie.id) ? (
                            <FaHeart className="text-white group-hover/btn:scale-110 transition-transform w-5 h-5" />
                          ) : (
                            <FaRegHeart className="text-white group-hover/btn:scale-110 transition-all w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsWatched(selectedMovie.id);
                          }}
                          className={`p-3 rounded-full cursor-pointer ${
                            watchedMovies.includes(selectedMovie.id)
                              ? "bg-blue-700/80"
                              : "bg-black/50"
                          } backdrop-blur-sm hover:bg-blue-700/80 transition-all duration-300 group/btn flex items-center justify-center`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white group-hover/btn:scale-110 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20">
                        <button
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer"
                          onClick={() => {
                            // Removed trailer functionality
                          }}
                        >
                          <FaPlay className="mr-2" /> View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-2/3">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                          {selectedMovie.title}
                        </h1>
                        <p className="text-xl text-gray-300 mb-6 italic">
                          "{selectedMovie.tagline}"
                        </p>

                        <div className="flex flex-wrap items-center mb-8 gap-3">
                          {selectedMovie.genres.map((genre) => (
                            <span
                              key={genre.id}
                              className="px-4 py-2 bg-red-900/40 backdrop-blur-sm border border-red-800/50 text-white rounded-full text-sm font-medium shadow-lg"
                            >
                              {genre.name}
                            </span>
                          ))}
                          <span className="px-4 py-2 bg-[#191920]/40 backdrop-blur-sm text-white rounded-full text-sm border border-gray-800/50 shadow-lg">
                            {new Date(selectedMovie.release_date).getFullYear()}
                          </span>
                          <span className="px-4 py-2 bg-[#191920]/40 backdrop-blur-sm text-white rounded-full text-sm border border-gray-800/50 shadow-lg">
                            {formattedRuntime(selectedMovie.runtime)}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center mb-8 gap-4">
                          <div className="bg-[#191920] p-4 rounded-xl border border-gray-800/50 shadow-lg flex items-center w-full sm:w-auto">
                            <div className="flex">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <span
                                    key={i}
                                    className="text-yellow-400 text-xl"
                                  >
                                    {i <
                                    Math.round(
                                      selectedMovie.vote_average / 2
                                    ) ? (
                                      <AiFillStar />
                                    ) : (
                                      <AiOutlineStar />
                                    )}
                                  </span>
                                ))}
                            </div>
                            <span className="ml-3 text-lg text-white font-bold">
                              {selectedMovie.vote_average}/10
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button
                              className={`${
                                watchedMovies.includes(selectedMovie.id)
                                  ? "bg-blue-700 hover:bg-blue-800"
                                  : "bg-[#191920] hover:bg-[#20202a] border border-gray-800/50"
                              } text-white font-medium py-3 sm:py-4 px-4 sm:px-6 cursor-pointer rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto text-sm sm:text-base`}
                              onClick={() =>
                                handleMarkAsWatched(selectedMovie.id)
                              }
                            >
                              {watchedMovies.includes(selectedMovie.id) ? (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  Watched
                                </>
                              ) : (
                                <>
                                  <MdLocalMovies className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                  <span className="hidden sm:inline">Mark as </span>Watched
                                </>
                              )}
                            </button>

                            <button
                              className={`${
                                favoriteMovies.includes(selectedMovie.id)
                                  ? "bg-red-600 hover:bg-red-700"
                                  : "bg-[#191920] hover:bg-[#20202a] border border-gray-800/50"
                              } text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl cursor-pointer flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto text-sm sm:text-base`}
                              onClick={() =>
                                favoriteMovies.includes(selectedMovie.id)
                                  ? handleRemoveFromFavorites(selectedMovie.id)
                                  : handleAddToFavorites(selectedMovie.id)
                              }
                            >
                              {favoriteMovies.includes(selectedMovie.id) ? (
                                <>
                                  <FaHeart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
                                  <span className="hidden sm:inline">Favorited</span>
                                  <span className="sm:hidden">Favorite</span>
                                </>
                              ) : (
                                <>
                                  <FaRegHeart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
                                  <span className="hidden sm:inline">Add to Favorites</span>
                                  <span className="sm:hidden">Favorite</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="bg-[#191920]/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 shadow-lg mb-8">
                          <h3 className="text-xl font-bold mb-4 text-gray-200">
                            Synopsis
                          </h3>
                          <p className="text-lg leading-relaxed text-gray-300">
                            {selectedMovie.overview}
                          </p>
                        </div>

                        <div className="bg-[#191920]/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 shadow-lg">
                          <h3 className="text-xl font-bold mb-4 text-gray-200">
                            Production
                          </h3>
                          <div className="flex flex-wrap gap-4">
                            {selectedMovie.production_companies.map(
                              (company) => (
                                <div
                                  key={company.id}
                                  className="bg-[#20202a] rounded-lg p-3"
                                >
                                  <span className="text-gray-300">
                                    {company.name}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-24">
                  <h2 className="text-3xl font-bold mb-10 text-center">
                    User Reviews
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {getMovieReviews(selectedMovie.id).map((review) => (
                      <div
                        key={review.id}
                        className="bg-[#191920]/80 backdrop-blur-md border border-gray-800/50 rounded-xl p-6 transition-all duration-500 hover:transform hover:scale-[1.01] hover:shadow-2xl hover:bg-[#20202a]/80"
                      >
                        <div className="flex items-center mb-4">
                          <img
                            src={review.avatar}
                            alt={review.author}
                            className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-gray-800"
                          />
                          <div>
                            <h4 className="font-semibold text-lg">
                              {review.author}
                            </h4>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <span
                                      key={i}
                                      className="text-yellow-400 text-sm"
                                    >
                                      {i < Math.floor(review.rating) ? (
                                        <AiFillStar />
                                      ) : i === Math.floor(review.rating) &&
                                        review.rating % 1 !== 0 ? (
                                        <AiOutlineStar className="text-yellow-400" />
                                      ) : (
                                        <AiOutlineStar />
                                      )}
                                    </span>
                                  ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-400">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed p-4 bg-[#0a0a0f]/60 rounded-lg border border-gray-800/30">
                          "{review.content}"
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#191920]/80 backdrop-blur-md border border-gray-800/50 rounded-xl p-8 mt-12 shadow-xl">
                    <h3 className="text-2xl font-bold mb-6">Add Your Review</h3>
                    <form
                      onSubmit={(e) => handleReviewSubmit(e, selectedMovie.id)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-300 mb-2"
                            htmlFor="author"
                          >
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="author"
                            name="author"
                            value={newReview.author}
                            onChange={handleReviewChange}
                            className="w-full bg-[#0a0a0f]/60 text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300"
                            placeholder="Enter your name"
                            required
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-300 mb-2"
                            htmlFor="rating"
                          >
                            Rating
                          </label>
                          <select
                            id="rating"
                            name="rating"
                            value={newReview.rating}
                            onChange={handleReviewChange}
                            className="w-full bg-[#0a0a0f]/60 text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 cursor-pointer appearance-none"
                          >
                            <option value={5}>5 Stars</option>
                            <option value={4.5}>4.5 Stars</option>
                            <option value={4}>4 Stars</option>
                            <option value={3.5}>3.5 Stars</option>
                            <option value={3}>3 Stars</option>
                            <option value={2.5}>2.5 Stars</option>
                            <option value={2}>2 Stars</option>
                            <option value={1.5}>1.5 Stars</option>
                            <option value={1}>1 Star</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-300 mb-2"
                          htmlFor="content"
                        >
                          Your Review
                        </label>
                        <textarea
                          id="content"
                          name="content"
                          value={newReview.content}
                          onChange={handleReviewChange}
                          rows={5}
                          className="w-full bg-[#0a0a0f]/60 text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300"
                          placeholder="Share your thoughts about this movie..."
                          required
                        ></textarea>
                      </div>
                      <div className="text-right">
                        <button
                          type="submit"
                          className="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          Submit Review
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <section id="home" className="relative h-screen overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920&h=1080&fit=crop"
                  alt="Hero Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-[#0a0a0f]/30 mix-blend-color-burn z-10"></div>

                {/* Animated dots overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIvPjwvc3ZnPg==')] opacity-40 z-10"></div>

                {/* Gradient shapes */}
                <div className="absolute -left-20 top-1/3 w-64 h-64 bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob z-10"></div>
                <div className="absolute -bottom-8 right-1/3 w-64 h-64 bg-yellow-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 z-10"></div>
                <div className="absolute -right-20 top-1/4 w-64 h-64 bg-red-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 z-10"></div>
              </div>

              <div className="relative h-full flex items-center z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-3xl">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 leading-tight animate-fadeIn">
                      Discover Your Next{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                        Favorite Movie
                      </span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 animate-fadeInUp animation-delay-300 max-w-xl leading-relaxed">
                      Explore thousands of movies, find detailed reviews, and
                      create your personalized watchlist. Your cinematic journey
                      starts here.
                    </p>
                    <div className="flex flex-wrap gap-5 animate-fadeInUp animation-delay-600">
                      <button
                        onClick={() => handleNavigation("trending")}
                        className="cursor-pointer bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-4 px-8 rounded-full flex items-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <FaPlay className="mr-3 h-4 w-4" /> Browse Movies
                      </button>
                      <button
                        onClick={() => handleNavigation("about")}
                        className="cursor-pointer bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/60 text-white font-medium py-4 px-8 border border-gray-700/50 rounded-full flex items-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </section>

            <section
              id="trending"
              className="relative bg-gradient-to-b from-[#0a0a0f] to-[#12121a] py-24"
            >
              <div className="absolute inset-0 overflow-hidden opacity-5">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')]"></div>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex flex-col items-center mb-16">
                  <span className="inline-block px-4 py-1 bg-red-900/30 backdrop-blur-sm text-red-400 text-sm font-medium rounded-full mb-4 border border-red-800/30">
                    Most Popular
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
                    Trending Now
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => scrollTrending("left")}
                    className="absolute -left-6 md:-left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 backdrop-blur-md text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 cursor-pointer"
                    aria-label="Scroll left"
                  >
                    <FaChevronLeft />
                  </button>

                  <div
                    ref={trendingCarouselRef}
                    className="flex overflow-x-auto scrollbar-hide py-8 snap-x snap-mandatory scroll-smooth gap-4 sm:gap-6"
                    onMouseEnter={() => setAutoScrollPaused(true)}
                    onMouseLeave={() => setAutoScrollPaused(false)}
                  >
                    {[...movies.slice(0, 10), ...movies.slice(0, 5)].map(
                      (movie, index) => (
                        <div
                          key={`${movie.id}-${index}`}
                          className="relative flex-none w-full sm:w-1/2 lg:w-1/3 snap-start cursor-pointer transform transition-all duration-500 hover:scale-105 px-2"
                          onClick={() => handleMovieClick(movie)}
                        >
                          <div className="relative rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)] h-[420px] sm:h-[450px] lg:h-[480px] group bg-[#191920]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>

                            <img
                              src={movie.poster_path}
                              alt={movie.title}
                              className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                            />

                            {/* Bottom gradient overlay for text readability */}
                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-15 pointer-events-none rounded-b-xl" />

                            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
                              {movie.genre_ids.slice(0, 2).map((genreId) => (
                                <span
                                  key={genreId}
                                  className="px-3 py-1 bg-red-900/60 backdrop-blur-sm text-white text-xs rounded-full border border-red-800/30 shadow-lg transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
                                >
                                  {getGenreName(genreId)}
                                </span>
                              ))}
                            </div>

                            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  favoriteMovies.includes(movie.id)
                                    ? handleRemoveFromFavorites(movie.id)
                                    : handleAddToFavorites(movie.id);
                                }}
                                className={`p-2 rounded-full cursor-pointer ${
                                  favoriteMovies.includes(movie.id)
                                    ? "bg-red-600/80"
                                    : "bg-black/50"
                                } backdrop-blur-sm hover:bg-red-600/80 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 flex items-center justify-center`}
                              >
                                {favoriteMovies.includes(movie.id) ? (
                                  <FaHeart className="text-white" />
                                ) : (
                                  <FaRegHeart className="text-white" />
                                )}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsWatched(movie.id);
                                }}
                                className={`p-2 rounded-full cursor-pointer ${
                                  watchedMovies.includes(movie.id)
                                    ? "bg-blue-700/80"
                                    : "bg-black/50"
                                } backdrop-blur-sm hover:bg-blue-700/80 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 flex items-center justify-center`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </button>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-in-out z-20">
                              <h3 className="text-xl font-bold text-white mb-3">
                                {movie.title}
                              </h3>
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-300 text-sm">
                                  {new Date(movie.release_date).getFullYear()}
                                </span>
                                <div className="flex items-center">
                                  <AiFillStar className="text-yellow-500 mr-1" />
                                  <span className="text-white font-medium">
                                    {movie.vote_average}
                                  </span>
                                </div>
                              </div>
                              <button className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                                <FaPlay className="mr-2 h-3 w-3" /> View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => scrollTrending("right")}
                    className="absolute -right-6 md:-right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 backdrop-blur-md text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 cursor-pointer"
                    aria-label="Scroll right"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </section>

            <section id="popular" className="bg-[#0a0a0f] py-24 relative">
              <div className="absolute inset-0 overflow-hidden opacity-5">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')]"></div>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16">
                  <div className="text-center md:text-left mb-8 md:mb-0">
                    <span className="inline-block px-4 py-1 bg-red-900/30 backdrop-blur-sm text-red-400 text-sm font-medium rounded-full mb-4 border border-red-800/30">
                      Top Rated
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                      Popular Movies
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 rounded-full hidden md:block"></div>
                    <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 rounded-full mx-auto md:hidden"></div>
                  </div>

                  <div className="flex flex-wrap gap-4 bg-[#191920]/60 backdrop-blur-sm p-5 rounded-xl border border-gray-800/50 shadow-2xl">
                    <div className="min-w-[150px]">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Genre
                      </label>
                      <select
                        className="w-full bg-[#12121a] text-white border border-gray-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-red-500 cursor-pointer transition-all duration-300"
                        value={selectedGenre}
                        onChange={handleGenreChange}
                      >
                        <option>All Genres</option>
                        {genres.map((genre) => (
                          <option key={genre.id} value={genre.name}>
                            {genre.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="min-w-[130px]">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Year
                      </label>
                      <select
                        className="w-full bg-[#12121a] text-white border border-gray-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-red-500 cursor-pointer transition-all duration-300"
                        value={selectedYear}
                        onChange={handleYearChange}
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="min-w-[130px]">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Rating
                      </label>
                      <select
                        className="w-full bg-[#12121a] text-white border border-gray-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-red-500 cursor-pointer transition-all duration-300"
                        value={selectedRating}
                        onChange={handleRatingChange}
                      >
                        {ratings.map((rating) => (
                          <option key={rating} value={rating}>
                            {rating}
                            {rating !== "All Ratings" ? " & up" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {getCurrentPageMovies().map((movie) => (
                    <div
                      key={movie.id}
                      className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                      onClick={() => handleMovieClick(movie)}
                    >
                      <div className="relative overflow-hidden rounded-xl shadow-2xl h-[400px] bg-[#191920] border border-gray-800/30">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>

                        <img
                          src={movie.poster_path}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                        />

                        {/* Bottom gradient overlay for text readability */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-15 pointer-events-none rounded-b-xl" />

                        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
                          {movie.genre_ids.slice(0, 2).map((genreId) => (
                            <span
                              key={genreId}
                              className="px-3 py-1 bg-red-900/60 backdrop-blur-sm text-white text-xs rounded-full border border-red-800/30 shadow-lg transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
                            >
                              {getGenreName(genreId)}
                            </span>
                          ))}
                        </div>

                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              favoriteMovies.includes(movie.id)
                                ? handleRemoveFromFavorites(movie.id)
                                : handleAddToFavorites(movie.id);
                            }}
                            className={`p-2 rounded-full cursor-pointer ${
                              favoriteMovies.includes(movie.id)
                                ? "bg-red-600/80"
                                : "bg-black/50"
                            } backdrop-blur-sm hover:bg-red-600/80 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 flex items-center justify-center`}
                          >
                            {favoriteMovies.includes(movie.id) ? (
                              <FaHeart className="text-white" />
                            ) : (
                              <FaRegHeart className="text-white" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsWatched(movie.id);
                            }}
                            className={`p-2 rounded-full cursor-pointer ${
                              watchedMovies.includes(movie.id)
                                ? "bg-blue-700/80"
                                : "bg-black/50"
                            } backdrop-blur-sm hover:bg-blue-700/80 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 flex items-center justify-center`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                          <h3 className="text-xl font-bold text-white mb-3 transition-transform duration-300">
                            {movie.title}
                          </h3>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-300 text-sm">
                              {new Date(movie.release_date).getFullYear()}
                            </span>
                            <div className="flex items-center">
                              <AiFillStar className="text-yellow-500 mr-1" />
                              <span className="text-white font-medium">
                                {movie.vote_average}
                              </span>
                            </div>
                          </div>
                          <button className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                            <FaPlay className="mr-2 h-3 w-3" /> View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* No Results and Reset Filter Section */}
                {filteredMovies.length === 0 && hasActiveFilters() && (
                  <div className="text-center py-16 px-4">
                    <div className="bg-[#191920]/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 md:p-12 shadow-2xl max-w-2xl mx-auto">
                      <div className="mb-6">
                        <svg
                          className="w-16 h-16 md:w-20 md:h-20 text-gray-500 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        No Movies Found
                      </h3>
                      <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-md mx-auto">
                        We couldn't find any movies matching your current filter criteria. 
                        Try adjusting your filters or reset them to see all movies.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                          onClick={handleResetFilters}
                          className="cursor-pointer bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-4 px-8 rounded-xl flex items-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
                        >
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Reset All Filters
                        </button>
                        <button
                          onClick={() => handleNavigation("trending")}
                          className="cursor-pointer bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/60 text-white font-medium py-4 px-8 border border-gray-700/50 rounded-xl flex items-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
                        >
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                          Browse Trending
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pagination - Only show when there are results */}
                {filteredMovies.length > 0 && (
                  <div className="mt-16 flex justify-center">
                    <div className="inline-flex bg-[#191920]/60 backdrop-blur-sm p-2 rounded-xl border border-gray-800/50 shadow-xl">
                      <button
                        className="bg-[#12121a] hover:bg-[#1a1a25] text-white font-medium py-3 px-5 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mx-1"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(
                          Math.max(0, currentPage - 3),
                          Math.min(totalPages, currentPage + 2)
                        )
                        .map((page) => (
                          <button
                            key={page}
                            className={`py-3 px-5 mx-1 rounded-lg transition-all duration-300 cursor-pointer ${
                              currentPage === page
                                ? "bg-red-600 text-white shadow-md"
                                : "bg-[#12121a] hover:bg-[#1a1a25] text-white"
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        ))}
                      <button
                        className="bg-[#12121a] hover:bg-[#1a1a25] text-white font-medium py-3 px-5 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mx-1"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section
              id="about"
              className="relative bg-gradient-to-b from-[#12121a] to-[#0a0a0f] py-24 overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden opacity-5">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')]"></div>
              </div>

              <div className="absolute -right-40 -top-40 w-96 h-96 bg-red-900 rounded-full opacity-5 blur-3xl"></div>
              <div className="absolute -left-40 -bottom-40 w-96 h-96 bg-red-900 rounded-full opacity-5 blur-3xl"></div>

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <span className="inline-block px-4 py-1 bg-red-900/30 backdrop-blur-sm text-red-400 text-sm font-medium rounded-full mb-4 border border-red-800/30">
                    About Us
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    About MovieFlix
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 rounded-full mx-auto"></div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-16">
                  <div className="md:w-1/2">
                    <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                      MovieFlix is your premier destination for discovering and
                      exploring the world of cinema. Our platform provides a
                      curated selection of films across various genres, complete
                      with detailed information, user ratings, and personalized
                      recommendations.
                    </p>
                    <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                      Whether you're a casual viewer or a cinema enthusiast,
                      MovieFlix helps you find your next favorite movie with our
                      advanced filtering system and comprehensive movie
                      database.
                    </p>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-[#191920]/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 shadow-xl text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-red-800/50">
                        <div className="text-3xl font-bold text-red-500 mb-2">
                          10K+
                        </div>
                        <div className="text-gray-400">Movies</div>
                      </div>
                      <div className="bg-[#191920]/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 shadow-xl text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-red-800/50">
                        <div className="text-3xl font-bold text-red-500 mb-2">
                          50K+
                        </div>
                        <div className="text-gray-400">Reviews</div>
                      </div>
                      <div className="bg-[#191920]/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 shadow-xl text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-red-800/50">
                        <div className="text-3xl font-bold text-red-500 mb-2">
                          80K+
                        </div>
                        <div className="text-gray-400">Users</div>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/2 mt-12 md:mt-0 md:block hidden">
                    <div className="relative h-[500px]">
                      <div className="absolute inset-0 grid grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div className="overflow-hidden rounded-xl shadow-2xl border border-gray-800/30 h-48 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                            <img
                              src="https://images.unsplash.com/photo-1585951237313-1979e4df7385?w=400&h=300&fit=crop"
                              alt="Cinema"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="overflow-hidden rounded-xl shadow-2xl border border-gray-800/30 h-64 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                            <img
                              src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=300&fit=crop"
                              alt="Movie Theater"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="space-y-6 mt-12">
                          <div className="overflow-hidden rounded-xl shadow-2xl border border-gray-800/30 h-64 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                            <img
                              src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop"
                              alt="Film"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="overflow-hidden rounded-xl shadow-2xl border border-gray-800/30 h-48 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                            <img
                              src="https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop"
                              alt="Cinema Experience"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
      <footer className="bg-gradient-to-b from-[#0a0a0f] to-[#05050a] text-white py-16 border-t border-gray-800/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute -right-40 -top-40 w-96 h-96 bg-red-900 rounded-full blur-3xl"></div>
          <div className="absolute -left-40 -bottom-40 w-96 h-96 bg-red-900 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="relative group">
                  <BiMoviePlay className="w-12 h-12 mr-4 text-red-500 transition-all duration-300 group-hover:text-red-400 group-hover:scale-110" />
                </div>
                <h2 className="text-3xl font-bold font-brand">
                  Movie<span className="text-red-500">Flix</span>
                </h2>
              </div>
              <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
                Discover the magic of cinema with us. Your premier destination
                for exploring movies across all genres. Join millions of movie lovers worldwide.
              </p>
              
              {/* Social media icons */}
              <div className="flex space-x-4">
                <a href="#" className="group p-3 bg-gray-800/50 hover:bg-red-600/20 rounded-full transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="group p-3 bg-gray-800/50 hover:bg-red-600/20 rounded-full transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="group p-3 bg-gray-800/50 hover:bg-red-600/20 rounded-full transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a href="#" className="group p-3 bg-gray-800/50 hover:bg-red-600/20 rounded-full transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Company links */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white font-subheading relative">
                Company
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-red-500 rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <span className="w-0 h-0.5 bg-red-500 group-hover:w-3 transition-all duration-300 mr-2"></span>
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <span className="w-0 h-0.5 bg-red-500 group-hover:w-3 transition-all duration-300 mr-2"></span>
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <span className="w-0 h-0.5 bg-red-500 group-hover:w-3 transition-all duration-300 mr-2"></span>
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <span className="w-0 h-0.5 bg-red-500 group-hover:w-3 transition-all duration-300 mr-2"></span>
                    Press
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources links */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white font-subheading relative">
                Resources
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-red-500 rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <span className="w-0 h-0.5 bg-red-500 group-hover:w-3 transition-all duration-300 mr-2"></span>
                    Movie API
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <span className="w-0 h-0.5 bg-red-500 group-hover:w-3 transition-all duration-300 mr-2"></span>
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <span className="w-0 h-0.5 bg-red-500 group-hover:w-3 transition-all duration-300 mr-2"></span>
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <span className="w-0 h-0.5 bg-red-500 group-hover:w-3 transition-all duration-300 mr-2"></span>
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter subscription */}
          <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-12 border border-red-800/30 relative">

            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Stay Updated</h3>
                <p className="text-gray-400">Get the latest movie recommendations and updates delivered to your inbox.</p>
              </div>
              <form onSubmit={handleNewsletterSubscription} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {isSubscribed ? null : <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={handleNewsletterEmailChange}
                  disabled={isSubscribed}
                  className={`px-4 py-3 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors w-full sm:w-80 ${
                    isSubscribed 
                      ? 'bg-gray-600/50 border-gray-600 cursor-not-allowed' 
                      : 'bg-gray-800/50 border-gray-700 focus:border-red-500'
                  }`}
                />}
                <button 
                  type="submit"
                  disabled={isSubscribed}
                  className={`px-6 cursor-pointer py-3 font-medium rounded-lg transition-all duration-300 whitespace-nowrap flex items-center justify-center ${
                    isSubscribed
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105'
                  }`}
                >
                  {isSubscribed ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Subscribed
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Bottom section */}
          <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-center md:text-left">
              © 2025 MovieFlix. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      <style jsx global>{`
        // @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Rajdhani:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&family=Orbitron:wght@400;500;600;700;800;900&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap");
        * {
          font-family: "Space Grotesk", -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, sans-serif;
        }

        /* Logo and Brand */
        .font-brand {
          font-family: "Space Grotesk", serif;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        /* Main Headlines */
        .font-heading {
          font-family: "Rajdhani", sans-serif;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        /* Movie Titles */
        .font-movie-title {
          font-family: "Orbitron", monospace;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        /* Subheadings */
        .font-subheading {
          font-family: "Rajdhani", sans-serif;
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        /* Body text stays Poppins */
        .font-body {
          font-family: "Poppins", sans-serif;
          font-weight: 400;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default App;