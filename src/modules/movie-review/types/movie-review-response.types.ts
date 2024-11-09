export type MovieReviewResponse = {
  movieReviewId: number;
  title: string;
  releaseDate: Date;
  rating: number;
  directors: string[];
  actors: string[];
  notes: string;
};
