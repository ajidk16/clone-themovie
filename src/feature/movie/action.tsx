/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import connection from "../../config/connection";

export const getPopularMovie = createAsyncThunk(
  "movie/list-popular",
  async (_, { rejectWithValue }) => {
    try {
      const res = await connection.get(
        `/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`
      );

      const messages = "something went wrong";
      if (res.status != 200) {
        throw new Error(messages);
      }

      return res.data;
      //   return data;
    } catch (e: any) {
      console.log("Error", e);
      return rejectWithValue(e.res.data);
    }
  }
);

export const getProviderMovie = createAsyncThunk(
  "movie/movie-providers",
  async (_, { rejectWithValue }) => {
    try {
      const res: any = await connection.get(
        `watch/providers/movie?language=en-US`
      );

      const messages = "something went wrong";
      if (res.status != 200) {
        throw new Error(messages);
      }

      return res.data.results;
      //   return data;
    } catch (e: any) {
      console.log("Error", e);
      return rejectWithValue(e.res.data);
    }
  }
);

`https://api.themoviedb.org/3/configuration/countries?language=en-US`;

export const getCountry = createAsyncThunk(
  "movie/countries",
  async (_, { rejectWithValue }) => {
    try {
      const res: any = await connection.get(
        `configuration/countries?language=en-US`
      );

      const messages = "something went wrong";
      if (res.status != 200) {
        throw new Error(messages);
      }
      // console.log(res.data);

      return res.data;
    } catch (e: any) {
      console.log("Error", e);
      return rejectWithValue(e.res.data);
    }
  }
);