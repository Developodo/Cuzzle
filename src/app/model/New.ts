
/**
 * This interface is used to store new data.
 * Is designed to be used with a wide range of new data.
 * For this reason, many of the parameters are optional.
 */
export interface New {
  author?: string;
  category?: string;
  country?: string;
  description: string;
  image: string;
  language?: string;
  published_at: string;
  source?: string;
  title: string;
  url: string;
}
