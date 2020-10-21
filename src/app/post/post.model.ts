/**like a contract to create own type to force certain object
 * to export to make avaliable outside of this file
 */
export interface Post {
  id: string;
  title: string;
  content: string;
  date: Date;
}
